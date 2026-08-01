// src/ui/tabs.ts
import { CATEGORIES } from "../config.js";
import { getLanguage, getView } from "../state.js";

export function createTabs(tabsEl: HTMLElement): void {
  tabsEl.innerHTML = "";
  const language = getLanguage();
  const view = getView();

  CATEGORIES.forEach((category) => {
    const btn = document.createElement("button");
    btn.classList.add("tab");
    btn.textContent = language === "es-ES" ? category.es : category.en;
    btn.dataset.id = String(category.id);
    if (view.type === "category" && String(view.value) === String(category.id)) {
      btn.classList.add("active");
    }
    tabsEl.appendChild(btn);
  });
}
