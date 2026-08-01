// src/ui/cards.ts
//
// DOM injection with document.createElement. Works exclusively with the
// Movie entity (already sanitized by the mapper) — it never sees raw
// poster_path or release_date fields.

import type { Movie } from "../entities/movie.js";
import { isFavorite } from "../favorites.js";
import { t } from "../i18n.js";

export function createCard(movie: Movie): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.id = String(movie.id);
  card.dataset.title = movie.title;
  card.dataset.poster = movie.posterUrl;
  card.dataset.year = movie.year;

  const poster = document.createElement("div");
  poster.classList.add("poster");

  const img = document.createElement("img");
  img.src = movie.posterUrl;
  img.alt = movie.title;

  const favBtn = document.createElement("button");
  favBtn.classList.add("fav-btn");
  favBtn.dataset.id = String(movie.id);
  const alreadyFavorite = isFavorite(movie.id);
  favBtn.innerHTML = alreadyFavorite ? "★" : "☆";
  if (alreadyFavorite) favBtn.classList.add("active");

  poster.appendChild(img);
  poster.appendChild(favBtn);

  const info = document.createElement("div");
  info.classList.add("card-info");

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const year = document.createElement("span");
  year.classList.add("year");
  year.textContent = movie.year || t("noDate");

  info.appendChild(title);
  info.appendChild(year);

  card.appendChild(poster);
  card.appendChild(info);

  return card;
}

export function renderMovies(container: HTMLElement, list: Movie[], emptyMessage: string): void {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="empty">${emptyMessage}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach((movie) => fragment.appendChild(createCard(movie)));
  container.appendChild(fragment);
}
