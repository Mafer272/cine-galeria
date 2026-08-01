// src/services/tmdbService.ts


import { API_KEY, BASE_URL, IMG_URL } from "../config.js";
import type { MovieDTO } from "../dtos/catalog-dto.js";
import type { Language } from "../state.js";

export { IMG_URL };

interface GenreDTO {
  id: number;
  name: string;
}

interface GenresResponseDTO {
  genres: GenreDTO[];
}

interface MoviesResponseDTO {
  results: MovieDTO[];
}

export async function getGenres(language: Language): Promise<Record<number, string>> {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${language}`;
  const res = await fetch(url);
  const data = (await res.json()) as GenresResponseDTO;
  const genresMap: Record<number, string> = {};
  data.genres.forEach((g) => {
    genresMap[g.id] = g.name;
  });
  return genresMap;
}

/**
 * Fetches the movie listing for a category/genre.
 * This is the "Catalog" service: the critical one that `genreCache.ts`
 * wraps to avoid unnecessary network requests.
 */
export async function getMovies(categoryId: string | number, language: Language): Promise<MovieDTO[]> {
  let url: string;
  if (categoryId === "all") {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${language}&page=1`;
  } else {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${language}&with_genres=${categoryId}&sort_by=popularity.desc`;
  }
  const res = await fetch(url);
  const data = (await res.json()) as MoviesResponseDTO;
  return data.results;
}

export async function searchMovies(query: string, language: Language): Promise<MovieDTO[]> {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=${language}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = (await res.json()) as MoviesResponseDTO;
  return data.results;
}

export async function getMovieDetail(id: string | number, language: Language): Promise<MovieDTO> {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${language}`;
  const res = await fetch(url);
  return (await res.json()) as MovieDTO;
}
