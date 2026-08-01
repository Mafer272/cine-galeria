// src/mappers/movieMapper.ts


import type { MovieDTO } from "../dtos/catalog-dto.js";
import type { Movie, MovieDetail } from "../entities/movie.js";
import { IMG_URL } from "../config.js";

const POSTER_PLACEHOLDER = "https://via.placeholder.com/300x445?text=No+image";

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
