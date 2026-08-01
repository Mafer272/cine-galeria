// src/config.ts
// Static configuration for the API (TMDb) and the category catalog.

export const API_KEY: string = "a31a6665b091c8dfe625ee8550f8c116";
export const BASE_URL: string = "https://api.themoviedb.org/3";
export const IMG_URL: string = "https://image.tmdb.org/t/p/w500";

export interface Category {
  id: string | number;
  es: string;
  en: string;
}

// Each category has its name in both languages, for the tabs.
export const CATEGORIES: Category[] = [
  { id: "all", es: "Todas", en: "All" },
  { id: 28, es: "Acción", en: "Action" },
  { id: 878, es: "Ciencia Ficción", en: "Science Fiction" },
  { id: 18, es: "Drama", en: "Drama" },
  { id: 35, es: "Comedia", en: "Comedy" },
  { id: 27, es: "Terror", en: "Horror" },
  { id: 16, es: "Animación", en: "Animation" },
  { id: "favs", es: "❤ Favoritos", en: "❤ Favorites" },
];
