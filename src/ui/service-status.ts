// src/ui/serviceStatus.ts
//
// Presentation layer for resilience: receives the already-resolved
// results from Promise.allSettled (typed) and renders them.

import { t } from "../i18n.js";
import type { CatalogResultDTO } from "../dtos/catalog-dto.js";
import type { ReviewsResponseDTO } from "../dtos/reviews-dto.js";
import type { AdsResponseDTO } from "../dtos/ads-dto.js";
import { mapReviewsDtoList } from "../mappers/review-mapper.js";
import { mapAdDto } from "../mappers/ad-mapper.js";

interface ServicesState {
  catalog: PromiseSettledResult<CatalogResultDTO>;
  reviews: PromiseSettledResult<ReviewsResponseDTO>;
  ads: PromiseSettledResult<AdsResponseDTO>;
}

export function renderServiceStatus(el: HTMLElement, { catalog, reviews, ads }: ServicesState): void {
  const pill = (label: string, settled: PromiseSettledResult<unknown>): string => {
    const ok = settled.status === "fulfilled";
    const cls = ok ? "pill pill--ok" : "pill pill--fail";
    const status = ok ? t("serviceOnline") : t("serviceDown");
    const reason = !ok && settled.reason instanceof Error ? settled.reason.message : "";
    return `<span class="${cls}" title="${reason}">${label}: ${status}</span>`;
  };

  el.innerHTML = [
    pill(t("catalogLabel"), catalog),
    pill(t("reviewsLabel"), reviews),
    pill(t("adsLabel"), ads),
  ].join("");
}

export function renderAdsBanner(el: HTMLElement, adsResult: PromiseSettledResult<AdsResponseDTO>): void {
  if (adsResult.status !== "fulfilled") {
    el.innerHTML = `<p class="banner banner--muted">${t("adsUnavailable")}</p>`;
    return;
  }
  const { title, validUntil } = mapAdDto(adsResult.value.data);
  el.innerHTML = `<p class="banner banner--ad">📣 ${title} <span>(${validUntil})</span></p>`;
}

export function renderReviewsPanel(el: HTMLElement, reviewsResult: PromiseSettledResult<ReviewsResponseDTO>): void {
  if (reviewsResult.status !== "fulfilled") {
    el.innerHTML = `<p class="empty-reviews">${t("reviewsUnavailable")}</p>`;
    return;
  }
  const reviews = mapReviewsDtoList(reviewsResult.value.data);
  el.innerHTML = reviews
    .map((r) => `<blockquote class="review-chip">"${r.comment}" <cite>— ${r.user}</cite></blockquote>`)
    .join("");
}

export function renderCacheIndicator(el: HTMLElement, { fromCache }: { fromCache: boolean }): void {
  el.textContent = fromCache ? `⚡ ${t("cacheHit")}` : `🌐 ${t("cacheMiss")}`;
  el.className = fromCache ? "cache-indicator cache-indicator--hit" : "cache-indicator cache-indicator--miss";
}
