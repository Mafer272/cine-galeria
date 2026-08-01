// src/mappers/reviewMapper.ts

import type { ReviewDTO } from "../dtos/reviews-dto.js";
import type { Review } from "../entities/review.js";

export function mapReviewDto(dto: ReviewDTO): Review {
  return { user: dto.user.trim(), comment: dto.comment.trim() };
}

export function mapReviewsDtoList(dtos: ReviewDTO[]): Review[] {
  return dtos.map(mapReviewDto);
}
