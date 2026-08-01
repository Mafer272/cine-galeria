// src/services/adsService.ts
//
// FICTITIOUS, independent backend service ("Promotional Ads"), typed
// against its own DTO. Also not critical.

import type { AdsResponseDTO } from "../dtos/ads-dto.js";
import type { Language } from "../state.js";

const LATENCY_MS = 700;
const FAILURE_RATE = 0.45; // 45% simulated failure probability

const MOCK_ADS: Record<Language, AdsResponseDTO["data"]> = {
  "es-ES": { title: "2x1 en boletos los martes", validUntil: "Todo el mes" },
  "en-US": { title: "2-for-1 tickets on Tuesdays", validUntil: "All month" },
};

export function fetchAds(language: Language): Promise<AdsResponseDTO> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const failed = Math.random() < FAILURE_RATE;
      if (failed) {
        reject(new Error("[Ads] Error 503: ads service is down"));
        return;
      }
      resolve({
        service: "ads",
        data: MOCK_ADS[language] ?? MOCK_ADS["es-ES"],
      });
    }, LATENCY_MS);
  });
}
