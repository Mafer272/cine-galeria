// src/entities/catalog-item.ts
//
// Minimal shape every entity must satisfy to be stored in a
// DataCatalogManager<T>. Movie, Series and Documentary all extend this.

export interface CatalogItem {
  id: string | number;
}