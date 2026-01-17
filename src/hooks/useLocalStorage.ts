import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with JSON serialization and error handling
 * @param key - localStorage key
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns [value, setValue] tuple similar to useState
 */
// Custom JSON reviver to handle Date objects
function dateReviver(_key: string, value: any): any {
  // Check if the value is a string that looks like an ISO date
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
    const date = new Date(value);
    // Verify it's a valid date
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return value;
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Initialize state with localStorage value or default
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item, dateReviver) : defaultValue;
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