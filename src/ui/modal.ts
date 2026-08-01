// src/ui/modal.ts
import { getMovieDetail } from "../services/tmdb-service.js";
import { mapCatalogDtoToDetail } from "../mappers/movie-mapper.js";
import type { MovieDetail, Movie } from "../entities/movie.js";
import { isFavorite, toggleFavorite } from "../favorites.js";
import { t } from "../i18n.js";
import { getLanguage } from "../state.js";

function requireElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found`);
  return el as T;
}

const modalOverlay = requireElement<HTMLDivElement>("modal-overlay");
const modalBody = requireElement<HTMLDivElement>("modal-body");
const modalClose = requireElement<HTMLButtonElement>("modal-close");

export type OnFavoriteChanged = (id: number, active: boolean) => void;

/**
 * Opens the detail modal for a movie. `countViews` is the closure from
 * Live Coding Step 3 (viewsCounter.ts), injected from app.ts.
 */
export function openMovieModal(
  id: string,
  countViews: () => number,
  onFavoriteChanged: OnFavoriteChanged
): void {
  getMovieDetail(id, getLanguage()).then((dto) => {
    const detail = mapCatalogDtoToDetail(dto);
    renderModal(detail, onFavoriteChanged);
    countViews();
  });
}

function renderModal(detail: MovieDetail, onFavoriteChanged: OnFavoriteChanged): void {
  modalBody.innerHTML = "";

  const img = document.createElement("img");
  img.classList.add("modal-poster");
  img.src = detail.posterUrl;
  img.alt = detail.title;

  const textBlock = document.createElement("div");
  textBlock.classList.add("modal-text");

  const title = document.createElement("h2");
  title.textContent = detail.title;

  const favBtnModal = document.createElement("button");
  favBtnModal.classList.add("fav-btn-modal");
  const alreadyFavorite = isFavorite(detail.id);
  favBtnModal.innerHTML = (alreadyFavorite ? "★" : "☆") + " " + (alreadyFavorite ? t("inFavorites") : t("addFavorite"));
  if (alreadyFavorite) favBtnModal.classList.add("active");

  favBtnModal.addEventListener("click", () => {
    const movie: Movie = {
      id: detail.id,
      title: detail.title,
      posterUrl: detail.posterUrl,
      year: detail.year,
    };
    toggleFavorite(movie);

    const active = favBtnModal.classList.toggle("active");
    favBtnModal.innerHTML = (active ? "★" : "☆") + " " + (active ? t("inFavorites") : t("addFavorite"));

    onFavoriteChanged(detail.id, active);
  });

  const meta = document.createElement("div");
  meta.classList.add("modal-meta");
  const year = detail.year || t("noDate");
  const runtime = detail.runtime ? detail.runtime + t("min") : t("runtimeNotAvailable");
  const rating = detail.rating || t("noRating");
  meta.textContent = `${year} · ${runtime} · ⭐ ${rating}`;

  const badges = document.createElement("div");
  detail.genres.forEach((genreName) => {
    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = genreName;
    badges.appendChild(badge);
  });

  const overview = document.createElement("p");
  overview.classList.add("overview");
  overview.textContent = detail.overview;

  textBlock.appendChild(title);
  textBlock.appendChild(favBtnModal);
  textBlock.appendChild(meta);
  textBlock.appendChild(badges);
  textBlock.appendChild(overview);

  modalBody.appendChild(img);
  modalBody.appendChild(textBlock);

  modalOverlay.classList.add("open");
}

export function initModal(): void {
  modalClose.addEventListener("click", () => {
    modalOverlay.classList.remove("open");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("open");
    }
  });
}
