// src/favorites.ts
// Favorites persisted to localStorage, now backed by the generic
// DataCatalogManager<Movie> instead of a hand-rolled Map — concrete
// proof the repository is reused, not just declared.

import type { Movie } from "./entities/movie.js";
import { DataCatalogManager } from "./repositories/data-catalog-manager.js";

const STORAGE_KEY = "galleryFavorites";
const favoritesCatalog = new DataCatalogManager<Movie>();

export function loadSavedFavorites(): void {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  try {
    const list = JSON.parse(data) as Movie[];
    favoritesCatalog.addMany(list);
  } catch (e) {
    console.error("Could not read saved favorites", e);
  }
}

function saveFavoritesToStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesCatalog.getAll()));
}

export function isFavorite(id: number): boolean {
  return favoritesCatalog.has(id);
}

export function toggleFavorite(movie: Movie): void {
  if (favoritesCatalog.has(movie.id)) {
    favoritesCatalog.remove(movie.id);
  } else {
    favoritesCatalog.add(movie);
  }
  saveFavoritesToStorage();
}

export function getFavorites(): Movie[] {
  return favoritesCatalog.getAll();
}

export function getFavoritesCount(): number {
  return favoritesCatalog.count();
}