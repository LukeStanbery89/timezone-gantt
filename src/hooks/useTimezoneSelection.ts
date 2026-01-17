import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Initialize with user's timezone on first load only
  useEffect(() => {
    const userTimezone = allTimezones.find(tz => tz.id === Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (userTimezone && selectedTimezones.length === 0) {
      setSelectedTimezones([userTimezone]);
    }
    // Only run on initial mount, not when selections change
  }, [allTimezones]);

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

  // Bulk selection functions
  const getSelectAllState = useCallback((filteredTimezones: TimezoneDisplay[]): boolean | null => {
    if (filteredTimezones.length === 0) return false;

    const filteredIds = new Set(filteredTimezones.map(tz => tz.id));
    const selectedFiltered = selectedTimezones.filter(tz => filteredIds.has(tz.id));

    if (selectedFiltered.length === 0) return false;
    if (selectedFiltered.length === filteredTimezones.length) return true;
    return null; // indeterminate
  }, [selectedTimezones]);

  const selectAllFiltered = useCallback((filteredTimezones: TimezoneDisplay[]) => {
    setSelectedTimezones(prev => {
      const newSelections = filteredTimezones.filter(tz => !prev.some(selected => selected.id === tz.id));
      return [...prev, ...newSelections];
    });
  }, []);

  const deselectAllFiltered = useCallback((filteredTimezones: TimezoneDisplay[]) => {
    setSelectedTimezones(prev => {
      const filteredIds = new Set(filteredTimezones.map(tz => tz.id));
      return prev.filter(tz => !filteredIds.has(tz.id));
    });
  }, []);

  return {
    selectedTimezones,
    availableTimezones,
    sortedTimezones,
    handleTimezoneToggle,
    setSelectedTimezones,
    getSelectAllState,
    selectAllFiltered,
    deselectAllFiltered,
  };
}