// src/dtos/catalog-dto.ts
//
// Models the RAW shape returned by the Catalog endpoint (TMDb), exactly
// as it arrives over the network, before any sanitization.

export interface MovieDTO {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  overview?: string;
  vote_average?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

/** Response from the cache closure wrapping the Catalog service. */
export interface CatalogResultDTO {
  data: MovieDTO[];
  fromCache: boolean;
}

// ============================================================
// Requirement 2 — Robustness against incomplete/corrupt contracts.
// ============================================================

/**
 * Real-world "chaos" payload: the network is free to omit ANY field
 * except `id` (an item with no id can't be stored or updated in the
 * catalog at all). Built by combining two utility types:
 *   - `Omit<MovieDTO, "id">` strips `id` out of the base shape.
 *   - `Partial<...>` then makes every remaining field optional.
 *   - `Pick<MovieDTO, "id">` adds `id` back in as the one guaranteed field.
 */
export type ChaosMovieDTO = Partial<Omit<MovieDTO, "id">> & Pick<MovieDTO, "id">;

/**
 * Safe subset of MovieDTO that's allowed to arrive as a *partial patch*
 * (e.g. a lightweight "refresh this movie's rating" event). Using
 * `Pick` here — instead of exposing the whole DTO — stops a caller from
 * accidentally patching fields that should never be partially updated.
 */
export type MoviePatchDTO = Partial<Pick<MovieDTO, "title" | "poster_path" | "release_date" | "vote_average">>;