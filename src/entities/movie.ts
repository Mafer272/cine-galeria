// src/entities/Movie.ts


export interface Movie {
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
