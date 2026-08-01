// src/app.ts
// Main orchestrator, in strict TypeScript. Imports everything as ESM
// modules and applies the DTO -> Mapper -> Entity pattern before any raw
// data reaches the UI.

import { getGenres, searchMovies } from "./services/tmdb-service.js";
import { fetchReviews } from "./services/reviews-service.js";
import { fetchAds } from "./services/ads-service.js";
import { createGenreCache } from "./cache/genre-cache.js";
import { createCounter } from "./views-counter.js";
import { mapCatalogDtoListToMovies } from "./mappers/movie-mapper.js";
import type { Movie } from "./entities/movie.js";
import {
  loadSavedFavorites,
  toggleFavorite,
  getFavorites,
  getFavoritesCount,
} from "./favorites.js";
import { t } from "./i18n.js";
import { getLanguage, setLanguage, getView, setView, setGenresMap, type Language } from "./state.js";
import { renderMovies } from "./ui/cards.js";
import { createTabs } from "./ui/tabs.js";
import { openMovieModal, initModal } from "./ui/modal.js";
import {
  renderServiceStatus,
  renderAdsBanner,
  renderReviewsPanel,
  renderCacheIndicator,
} from "./ui/service-status.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

// --- DOM references ---
const container = requireElement<HTMLElement>("movies");
const spinner = requireElement<HTMLElement>("spinner");
const spinnerText = requireElement<HTMLElement>("spinner-text");
const tabsEl = requireElement<HTMLElement>("tabs");
const favoritesCounterEl = requireElement<HTMLElement>("favorites");
const searchInput = requireElement<HTMLInputElement>("search-input");
const languageEl = requireElement<HTMLElement>("language");
const serviceStatusEl = requireElement<HTMLElement>("service-status");
const adsBannerEl = requireElement<HTMLElement>("ads-banner");
const reviewsPanelEl = requireElement<HTMLElement>("reviews-panel");
const cacheIndicatorEl = requireElement<HTMLElement>("cache-indicator");

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

// 🔒 Single instance of the closure-encapsulated cache.
const genreCache = createGenreCache();

// Live Coding Step 3: protected closure, detail-modal view counter.
const countViews = createCounter();

function updateFavoritesCounter(): void {
  favoritesCounterEl.textContent = t("favoritesLabel") + getFavoritesCount();
}

function showSpinner(text: string): void {
  spinnerText.textContent = text;
  spinner.style.display = "flex";
}

function hideSpinner(): void {
  spinner.style.display = "none";
}

/**
 * Resilient Concurrent Orchestration: queries the 3 "microservices" in
 * parallel with Promise.allSettled. A failure in Reviews or Ads must
 * NEVER prevent the movie grid from rendering.
 */
async function loadCategory(categoryId: string | number): Promise<void> {
  setView({ type: "category", value: categoryId });

  if (categoryId === "favs") {
    hideSpinner();
    adsBannerEl.innerHTML = "";
    reviewsPanelEl.innerHTML = "";
    cacheIndicatorEl.textContent = "";
    serviceStatusEl.innerHTML = "";
    renderMovies(container, getFavorites(), t("noFavorites"));
    return;
  }

  showSpinner(t("loading"));
  container.innerHTML = "";
  cacheIndicatorEl.textContent = "";

  const language = getLanguage();

  const [catalogResult, reviewsResult, adsResult] = await Promise.allSettled([
    genreCache.getByCategory(categoryId, language),
    fetchReviews(language),
    fetchAds(language),
  ]);

  hideSpinner();

  renderServiceStatus(serviceStatusEl, {
    catalog: catalogResult,
    reviews: reviewsResult,
    ads: adsResult,
  });

  // --- Catalog (critical): DTO -> Entity through the mapper ---
  if (catalogResult.status === "fulfilled") {
    const movies = mapCatalogDtoListToMovies(catalogResult.value.data);
    renderMovies(container, movies, t("error"));
    renderCacheIndicator(cacheIndicatorEl, { fromCache: catalogResult.value.fromCache });
  } else {
    container.innerHTML = `<p class="empty">${t("error")}</p>`;
    console.error("Critical catalog failure:", catalogResult.reason);
  }

  // --- Reviews and Ads (non-critical, degrade gracefully) ---
  renderReviewsPanel(reviewsPanelEl, reviewsResult);
  renderAdsBanner(adsBannerEl, adsResult);
}

function runSearch(query: string): void {
  setView({ type: "search", value: query });

  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  adsBannerEl.innerHTML = "";
  reviewsPanelEl.innerHTML = "";
  cacheIndicatorEl.textContent = "";
  serviceStatusEl.innerHTML = "";

  showSpinner(t("searching"));
  container.innerHTML = "";

  searchMovies(query, getLanguage())
    .then((dtos) => {
      hideSpinner();
      renderMovies(container, mapCatalogDtoListToMovies(dtos), t("noSearchResults"));
    })
    .catch((err) => {
      hideSpinner();
      container.innerHTML = `<p class="empty">${t("error")}</p>`;
      console.error(err);
    });
}

// ================================
// Live Coding Step 2: Event Delegation
// ================================
container.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  const favBtn = target.closest<HTMLElement>(".fav-btn");
  if (favBtn) {
    e.stopPropagation();

    const card = favBtn.closest<HTMLElement>(".card");
    if (!card) return;

    const movie: Movie = {
      id: Number(card.dataset.id),
      title: card.dataset.title ?? "",
      posterUrl: card.dataset.poster ?? "",
      year: card.dataset.year ?? "",
    };

    toggleFavorite(movie);
    updateFavoritesCounter();

    const active = favBtn.classList.toggle("active");
    favBtn.innerHTML = active ? "★" : "☆";
    return;
  }

  const card = target.closest<HTMLElement>(".card");
  if (!card || !card.dataset.id) return;

  openMovieModal(card.dataset.id, countViews, (id, active) => {
    const cardInGrid = container.querySelector<HTMLElement>(`.card[data-id="${id}"] .fav-btn`);
    if (cardInGrid) {
      cardInGrid.classList.toggle("active", active);
      cardInGrid.innerHTML = active ? "★" : "☆";
    }
    updateFavoritesCounter();
  });
});

tabsEl.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLElement>(".tab");
  if (!btn || !btn.dataset.id) return;

  searchInput.value = "";

  document.querySelectorAll(".tab").forEach((el) => el.classList.remove("active"));
  btn.classList.add("active");

  loadCategory(btn.dataset.id);
});

// --- Debounced search ---
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    if (query.length === 0) {
      createTabs(tabsEl);
      loadCategory("all");
    } else if (query.length >= 2) {
      runSearch(query);
    }
  }, 400);
});

// --- Language button ---
languageEl.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLElement>(".language-btn");
  if (!btn || !btn.dataset.lang) return;

  const newLanguage = btn.dataset.lang as Language;
  if (newLanguage === getLanguage()) return;

  setLanguage(newLanguage);

  document.querySelectorAll(".language-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  searchInput.placeholder = t("searchPlaceholder");
  updateFavoritesCounter();

  getGenres(newLanguage).then((genresMap) => {
    setGenresMap(genresMap);
    createTabs(tabsEl);

    const view = getView();
    if (view.type === "search" && searchInput.value.trim().length >= 2) {
      runSearch(searchInput.value.trim());
    } else {
      loadCategory(view.type === "category" ? view.value : "all");
    }
  });
});

// --- Bootstrap ---
loadSavedFavorites();
updateFavoritesCounter();
createTabs(tabsEl);
initModal();
showSpinner(t("loading"));

getGenres(getLanguage()).then((genresMap) => {
  setGenresMap(genresMap);
  loadCategory("all");
});
