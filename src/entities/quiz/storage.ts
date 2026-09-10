import type { QuizResult } from "./model";

const storageKey = "bitrix-task-test-results";

export function getResults(): QuizResult[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as QuizResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: QuizResult) {
  localStorage.setItem(storageKey, JSON.stringify([result, ...getResults()]));
}

export function clearResults() {
  localStorage.removeItem(storageKey);
}
