// src/state.ts
// Single place where the app's mutable state lives.

export type Language = "es-ES" | "en-US";

export interface View {
  type: "category" | "search";
  value: string | number;
}

let currentLanguage: Language = "es-ES";
let currentView: View = { type: "category", value: "all" };
let genresMap: Record<number, string> = {};

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(newLanguage: Language): void {
  currentLanguage = newLanguage;
}

export function getView(): View {
  return currentView;
}

export function setView(newView: View): void {
  currentView = newView;
}

export function getGenresMap(): Record<number, string> {
  return genresMap;
}

export function setGenresMap(newMap: Record<number, string>): void {
  genresMap = newMap;
}
