// src/dtos/ReviewsDTO.ts
//
// Models the raw shape returned by the fictitious Reviews endpoint.

export interface ReviewDTO {
  user: string;
  comment: string;
}

export interface ReviewsResponseDTO {
  service: "reviews";
  data: ReviewDTO[];
}
