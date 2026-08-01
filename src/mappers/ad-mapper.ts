// src/mappers/adMapper.ts

import type { AdDTO } from "../dtos/ads-dto.js";
import type { Ad } from "../entities/ad.js";

export function mapAdDto(dto: AdDTO): Ad {
  return { title: dto.title.trim(), validUntil: dto.validUntil.trim() };
}
