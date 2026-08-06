// src/entities/documentary.ts

import type { CatalogItem } from "./catalog-item.js";

export interface Documentary extends CatalogItem {
  id: number;
  title: string;
  posterUrl: string;
  year: string;
  director: string;
}