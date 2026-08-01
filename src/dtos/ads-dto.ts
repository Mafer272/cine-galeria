// src/dtos/AdsDTO.ts
//
// Models the raw shape returned by the fictitious Ads endpoint.

export interface AdDTO {
  title: string;
  validUntil: string;
}

export interface AdsResponseDTO {
  service: "ads";
  data: AdDTO;
}
