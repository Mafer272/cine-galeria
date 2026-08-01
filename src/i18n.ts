// src/i18n.ts


import { getLanguage } from "./state.js";

export const TEXTS = {
  "es-ES": {
    loading: "Cargando películas...",
    searching: "Buscando...",
    noSearchResults: "No se encontraron películas con ese nombre.",
    noFavorites: "Todavía no tenés películas favoritas. Marcá alguna con la estrella ☆.",
    error: "Ocurrió un error al cargar. Revisá tu API key.",
    favoritesLabel: "❤ Favoritos: ",
    addFavorite: "Agregar a favoritos",
    inFavorites: "En favoritos",
    searchPlaceholder: "Buscar película por título...",
    noDate: "Sin fecha",
    noRating: "Sin calificación",
    runtimeNotAvailable: "Duración no disponible",
    min: " min",
    serviceOnline: "en línea",
    serviceDown: "no disponible",
    catalogLabel: "Catálogo",
    reviewsLabel: "Reseñas",
    adsLabel: "Anuncios",
    reviewsUnavailable: "No se pudieron cargar las reseñas de la comunidad en este momento.",
    adsUnavailable: "Sin promociones disponibles por ahora.",
    cacheHit: "servido desde caché (sin nueva llamada a la API)",
    cacheMiss: "obtenido de la API y guardado en caché",
  },
  "en-US": {
    loading: "Loading movies...",
    searching: "Searching...",
    noSearchResults: "No movies found with that title.",
    noFavorites: "You don't have favorite movies yet. Mark one with the star ☆.",
    error: "There was an error loading data. Check your API key.",
    favoritesLabel: "❤ Favorites: ",
    addFavorite: "Add to favorites",
    inFavorites: "In favorites",
    searchPlaceholder: "Search movie by title...",
    noDate: "No date",
    noRating: "No rating",
    runtimeNotAvailable: "Runtime not available",
    min: " min",
    serviceOnline: "online",
    serviceDown: "unavailable",
    catalogLabel: "Catalog",
    reviewsLabel: "Reviews",
    adsLabel: "Ads",
    reviewsUnavailable: "Community reviews couldn't be loaded right now.",
    adsUnavailable: "No promotions available right now.",
    cacheHit: "served from cache (no new API call)",
    cacheMiss: "fetched from the API and cached",
  },
};

export type TextKey = keyof typeof TEXTS["es-ES"];

export function t(key: TextKey): string {
  return TEXTS[getLanguage()][key];
}
