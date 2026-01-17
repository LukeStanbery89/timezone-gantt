import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with JSON serialization and error handling
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Initialize state with localStorage value or default
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Failed to read ${key} from localStorage:`, error);
      return defaultValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}