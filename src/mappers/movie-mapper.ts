// src/mappers/movie-mapper.ts
//
// Pure adapter: never fetches, never touches the DOM, never throws on
// missing fields — it only transforms raw DTO -> sanitized Entity,
// resolving null/missing values with safe defaults.

import type { MovieDTO, ChaosMovieDTO, MoviePatchDTO } from "../dtos/catalog-dto.js";
import type { Movie, MovieDetail } from "../entities/movie.js";
import { IMG_URL } from "../config.js";

const POSTER_PLACEHOLDER = "https://via.placeholder.com/300x445?text=No+image";

// Requirement 2 — business defaults used whenever the network sends a
// missing or null value instead of the real one.
const DEFAULT_TITLE = "Untitled";
const DEFAULT_YEAR = "";

export function mapCatalogDtoToMovie(dto: MovieDTO): Movie {
  return {
    id: dto.id,
    title: dto.title,
    posterUrl: dto.poster_path ? IMG_URL + dto.poster_path : POSTER_PLACEHOLDER,
    year: dto.release_date ? dto.release_date.substring(0, 4) : "",
  };
}

export function mapCatalogDtoListToMovies(dtos: MovieDTO[]): Movie[] {
  return dtos.map(mapCatalogDtoToMovie);
}

export function mapCatalogDtoToDetail(dto: MovieDTO): MovieDetail {
  return {
    ...mapCatalogDtoToMovie(dto),
    overview: dto.overview ?? "",
    rating: dto.vote_average != null ? `${dto.vote_average.toFixed(1)} / 10` : "",
    runtime: dto.runtime != null ? String(dto.runtime) : "",
    genres: (dto.genres ?? []).map((g) => g.name),
  };
}

/**
 * Requirement 2 — Robustness against incomplete/corrupt contracts.
 *
 * Accepts a `ChaosMovieDTO` (every field optional except `id`, built
 * from `Partial<Omit<MovieDTO, "id">> & Pick<MovieDTO, "id">`) and
 * always returns a fully-formed `Movie`, never `undefined` and never a
 * type with optional fields — every gap is filled with a business
 * default instead of leaking `null`/`undefined` into the UI layer.
 */
export function mapChaosDtoToMovie(dto: ChaosMovieDTO): Movie {
  return {
    id: dto.id,
    title: dto.title?.trim() || DEFAULT_TITLE,
    posterUrl: dto.poster_path ? IMG_URL + dto.poster_path : POSTER_PLACEHOLDER,
    year: dto.release_date ? dto.release_date.substring(0, 4) : DEFAULT_YEAR,
  };
}

/**
 * Requirement 2 — safe partial update schema.
 *
 * Takes a `MoviePatchDTO` (a `Partial<Pick<MovieDTO, ...>>` — only a
 * few whitelisted fields, all optional) and turns it into a
 * `Partial<Movie>` ready to hand to
 * `DataCatalogManager.updateById(id, patch)`. Fields that arrive as
 * `null`/`undefined` are simply omitted from the patch instead of
 * overwriting good cached data with garbage.
 */
export function sanitizeMoviePatch(raw: MoviePatchDTO): Partial<Movie> {
  const patch: Partial<Movie> = {};

  if (raw.title) {
    patch.title = raw.title.trim();
  }
  if (raw.poster_path) {
    patch.posterUrl = IMG_URL + raw.poster_path;
  }
  if (raw.release_date) {
    patch.year = raw.release_date.substring(0, 4);
  }

  return patch;
}