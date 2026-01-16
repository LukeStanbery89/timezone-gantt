import { useMemo } from 'react';
import { TimezoneDisplay } from '@/types';
import { getAllTimezones } from '@/utils/timezoneUtils';

/**
 * Custom hook for managing timezone data with caching and filtering
 */
export function useTimezoneData() {
  const allTimezones = useMemo(() => getAllTimezones(), []);

  const getAvailableTimezones = (showOnlyBusinessTimezones: boolean): TimezoneDisplay[] => {
    return showOnlyBusinessTimezones
      ? allTimezones.filter(tz => tz.isBusiness)
      : allTimezones;
  };

  return {
    allTimezones,
    getAvailableTimezones,
  };
}