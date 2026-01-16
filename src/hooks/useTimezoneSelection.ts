import { useState, useEffect, useMemo } from 'react';
import { TimezoneDisplay } from '@/types';
import { getAllTimezones } from '@/utils/timezoneUtils';

/**
 * Custom hook for managing timezone selection and filtering logic
 */
export function useTimezoneSelection(showOnlyBusinessTimezones: boolean) {
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneDisplay[]>([]);

  const allTimezones = useMemo(() => getAllTimezones(), []);
  const availableTimezones = useMemo(() =>
    showOnlyBusinessTimezones
      ? allTimezones.filter(tz => tz.isBusiness)
      : allTimezones,
    [allTimezones, showOnlyBusinessTimezones]
  );

  // Initialize with user's timezone
  useEffect(() => {
    const userTimezone = allTimezones.find(tz => tz.id === Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (userTimezone && selectedTimezones.length === 0) {
      setSelectedTimezones([userTimezone]);
    }
  }, [allTimezones, selectedTimezones.length]);

  const handleTimezoneToggle = useMemo(() =>
    (timezone: TimezoneDisplay) => {
      setSelectedTimezones(prev => {
        const exists = prev.find(tz => tz.id === timezone.id);
        if (exists) {
          return prev.filter(tz => tz.id !== timezone.id);
        } else {
          return [...prev, timezone];
        }
      });
    },
    []
  );

  const sortedTimezones = useMemo(() =>
    [...selectedTimezones].sort((a, b) => a.offset - b.offset),
    [selectedTimezones]
  );

  return {
    selectedTimezones,
    availableTimezones,
    sortedTimezones,
    handleTimezoneToggle,
    setSelectedTimezones,
  };
}