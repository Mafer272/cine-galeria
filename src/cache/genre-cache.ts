// src/cache/genreCache.ts
//
// Closure-encapsulated async cache. `store` is private and only holds
// `MovieDTO[]`, the raw shape returned by the Catalog before it passes
// through the mapper.

import { getMovies } from "../services/tmdb-service.js";
import type { MovieDTO, CatalogResultDTO } from "../dtos/catalog-dto.js";
import type { Language } from "../state.js";

export interface GenreCache {
  getByCategory(categoryId: string | number, language: Language): Promise<CatalogResultDTO>;
  getCacheSnapshot(): Record<string, MovieDTO[]>;
}

export function createGenreCache(): GenreCache {
  // 🔒 Private variable: lives only inside this closure.
  const store: Record<string, MovieDTO[]> = {};

  return {
    async getByCategory(categoryId, language) {
      const key = `${language}::${categoryId}`;

      // ✅ HIT: no new request is fired.
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        return { data: store[key], fromCache: true };
      }

      // ❌ MISS: hit TMDb for real and store the result.
      const data = await getMovies(categoryId, language);
      store[key] = data;
      return { data, fromCache: false };
    },

    getCacheSnapshot() {
      return { ...store };
    },
  };
}
