// src/services/reviewsService.ts
//
// FICTITIOUS, independent backend service ("User Reviews"), typed
// against its own DTO. Not critical: if it fails, the catalog must keep
// rendering without issue.

import type { ReviewsResponseDTO } from "../dtos/reviews-dto.js";
import type { Language } from "../state.js";

const LATENCY_MS = 900;
const FAILURE_RATE = 0.4; // 40% simulated failure probability

const MOCK_REVIEWS: Record<Language, ReviewsResponseDTO["data"]> = {
  "es-ES": [
    { user: "cine_fan88", comment: "Ritmo impecable y un clímax que se siente ganado." },
    { user: "criticaHonesta", comment: "Guion sobresaliente, personajes bien construidos." },
    { user: "sala_oscura", comment: "La fotografía sostiene toda la película." },
  ],
  "en-US": [
    { user: "cine_fan88", comment: "Flawless pacing and a climax that feels earned." },
    { user: "criticaHonesta", comment: "Outstanding script, well-built characters." },
    { user: "sala_oscura", comment: "The cinematography carries the whole film." },
  ],
};

export function fetchReviews(language: Language): Promise<ReviewsResponseDTO> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const failed = Math.random() < FAILURE_RATE;
      if (failed) {
        reject(new Error("[Reviews] Timeout: the reviews service did not respond"));
        return;
      }
      resolve({
        service: "reviews",
        data: MOCK_REVIEWS[language] ?? MOCK_REVIEWS["es-ES"],
      });
    }, LATENCY_MS);
  });
}
