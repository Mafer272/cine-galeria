// src/entities/movie.ts
//
// Domain entity: the "clean" shape the whole UI works with. It never
// exposes TMDb's raw fields (poster_path, release_date, etc.) directly
// to cards or the modal.

import type { CatalogItem } from "./catalog-item.js";

export interface Movie extends CatalogItem {
  id: number;
  title: string;
  posterUrl: string;
  year: string;
}

export interface MovieDetail extends Movie {
  overview: string;
  rating: string;
  runtime: string;
  genres: string[];
}