// src/favorites.ts
// Favorites persisted to localStorage, typed against the Movie entity.

import type { Movie } from "./entities/movie.js";

const STORAGE_KEY = "galleryFavorites";
const favoritesMap = new Map<number, Movie>();

export function loadSavedFavorites(): void {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  try {
    const list = JSON.parse(data) as Movie[];
    list.forEach((movie) => favoritesMap.set(movie.id, movie));
  } catch (e) {
    console.error("Could not read saved favorites", e);
  }
}

function saveFavoritesToStorage(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favoritesMap.values())));
}

export function isFavorite(id: number): boolean {
  return favoritesMap.has(id);
}

export function toggleFavorite(movie: Movie): void {
  if (favoritesMap.has(movie.id)) {
    favoritesMap.delete(movie.id);
  } else {
    favoritesMap.set(movie.id, movie);
  }
  saveFavoritesToStorage();
}

export function getFavorites(): Movie[] {
  return Array.from(favoritesMap.values());
}

export function getFavoritesCount(): number {
  return favoritesMap.size;
}
