import { useMemo, useCallback } from 'react';
import { TimezoneDisplay } from '@/types';
import { getAllTimezones } from '@/utils/timezoneUtils';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing timezone selection and filtering logic
 */
export function useTimezoneSelection(showOnlyBusinessTimezones: boolean) {
  const allTimezones = useMemo(() => getAllTimezones(), []);
  const availableTimezones = useMemo(() =>
    showOnlyBusinessTimezones
      ? allTimezones.filter(tz => tz.isBusiness)
      : allTimezones,
    [allTimezones, showOnlyBusinessTimezones]
  );

  // Initialize with user's timezone if localStorage is empty
  const defaultTimezones: TimezoneDisplay[] = [];
  const userTimezone = allTimezones.find(tz => tz.id === Intl.DateTimeFormat().resolvedOptions().timeZone);
  if (userTimezone) {
    defaultTimezones.push(userTimezone);
  }

  const [selectedTimezones, setSelectedTimezones] = useLocalStorage<TimezoneDisplay[]>(
    'timezone-gantt-selected-timezones',
    defaultTimezones
  );

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