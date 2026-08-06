// src/entities/series.ts

import type { CatalogItem } from "./catalog-item.js";

export interface Series extends CatalogItem {
  id: number;
  title: string;
  posterUrl: string;
  year: string;
  seasons: number;
}