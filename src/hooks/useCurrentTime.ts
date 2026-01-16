import { useState, useEffect } from 'react';

/**
 * Hook that returns the current time and updates every minute
 */
export function useCurrentTime(): Date {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}