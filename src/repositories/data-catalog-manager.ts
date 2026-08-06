// src/repositories/data-catalog-manager.ts
//
// Requirement 1 — Generic Content Repository Abstraction.
//
// A single, reusable class that manages an in-memory collection of ANY
// entity satisfying `{ id: string | number }` — Movie, Series,
// Documentary, or any future entity — without duplicating a line of
// code per type. Every method preserves T all the way through its
// return signature, so `new DataCatalogManager<Movie>().getAll()`
// returns `Movie[]`, never `any[]` or a loosened union.

import type { CatalogItem } from "../entities/catalog-item.js";

export class DataCatalogManager<T extends CatalogItem> {
  private readonly items = new Map<string | number, T>();

  /** Adds or overwrites a single item, keyed by its own `id`. */
  add(item: T): void {
    this.items.set(item.id, item);
  }

  /** Bulk-loads a list — used right after a network fetch resolves. */
  addMany(list: T[]): void {
    list.forEach((item) => this.add(item));
  }

  getById(id: string | number): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  remove(id: string | number): boolean {
    return this.items.delete(id);
  }

  has(id: string | number): boolean {
    return this.items.has(id);
  }

  count(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  /**
   * Polymorphic filter: identical logic works whether T is Movie,
   * Series, or Documentary — the predicate is fully typed against T,
   * and the return type stays T[], never widened to any[].
   */
  filter(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  /**
   * Type-safe field lookup: `field` is constrained to `keyof T`, so
   * calling `findByField("titel", ...)` (a typo) is a compile-time
   * error, not a silent runtime bug.
   */
  findByField<K extends keyof T>(field: K, value: T[K]): T[] {
    return this.filter((item) => item[field] === value);
  }

  /**
   * Requirement 2 hook: safe partial update. `patch` is `Partial<T>`,
   * so callers only send the fields that actually changed — the rest
   * of the stored item is preserved untouched. Returns the updated
   * item, or `undefined` if no item with that id exists yet.
   */
  updateById(id: string | number, patch: Partial<T>): T | undefined {
    const current = this.items.get(id);
    if (!current) return undefined;
    const updated: T = { ...current, ...patch };
    this.items.set(id, updated);
    return updated;
  }
}