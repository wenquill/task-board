import { useEffect, useState } from 'react';

/**
 * Generic `useState` wrapper that persists the value in `localStorage`.
 *
 * - Reads the initial value from storage on mount (falls back to `defaultValue`).
 * - Writes back to storage whenever the value changes.
 * - JSON-serialises/deserialises automatically.
 * - Storage errors (e.g. private browsing quota) are caught and logged so they
 *   never propagate to the caller.
 *
 * @param key           The localStorage key to read/write.
 * @param defaultValue  Fallback used when no stored value exists yet.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Error getting localStorage key ${key}:`, error);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key ${key}:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
