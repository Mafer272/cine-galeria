// src/cache/genreCache.ts


import { getMovies } from "../services/tmdb-service.js";
import type { MovieDTO, CatalogResultDTO } from "../dtos/catalog-dto.js";
import type { Language } from "../state.js";

export interface GenreCache {
  getByCategory(categoryId: string | number, language: Language): Promise<CatalogResultDTO>;
  getCacheSnapshot(): Record<string, MovieDTO[]>;
}

export function createGenreCache(): GenreCache {

  const store: Record<string, MovieDTO[]> = {};

  return {
    async getByCategory(categoryId, language) {
      const key = `${language}::${categoryId}`;

      
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        return { data: store[key], fromCache: true };
      }

     
      const data = await getMovies(categoryId, language);
      store[key] = data;
      return { data, fromCache: false };
    },

    getCacheSnapshot() {
      return { ...store };
    },
  };
}
