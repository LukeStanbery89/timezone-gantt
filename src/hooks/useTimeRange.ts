import { useState } from 'react';
import { TimeRange } from '@/types';
import { getUserTimezone } from '@/utils/timezoneUtils';

/**
 * Custom hook for managing time range state and validation
 */
export function useTimeRange() {
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    const userTimezone = getUserTimezone();

    // Round current time up to nearest hour
    const startTime = new Date();
    if (startTime.getMinutes() > 0) {
      startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
    } else {
      startTime.setMinutes(0, 0, 0);
    }

    // Set end time to start time + 1 hour
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    return {
      startDate: startTime,
      endDate: endTime,
      referenceTimezone: userTimezone.id,
    };
  });

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  return {
    timeRange,
    handleTimeRangeChange,
  };
}