// src/dtos/CatalogDTO.ts
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
