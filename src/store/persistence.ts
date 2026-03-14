import type { AppState } from '../types';

const STORAGE_KEY = 'kanban-todos-v1';

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch (error) {
    console.error(
      `Error loading from localStorage key "${STORAGE_KEY}":`,
      error
    );
  }
  return null;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving to localStorage key "${STORAGE_KEY}":`, error);
  }
}
