import { useState } from 'react';
import { TimeRange } from '@/types';
import { useTimezoneSelection } from '@/hooks/useTimezoneSelection';
import { useTimeRange } from '@/hooks/useTimeRange';
import { useTimezoneData } from '@/hooks/useTimezoneData';
import TimezoneGanttView from './TimezoneGanttView';

function TimezoneGantt() {
  const [showOnlyBusinessTimezones, setShowOnlyBusinessTimezones] = useState(true);

  const timezoneData = useTimezoneData();
  const availableTimezones = timezoneData.getAvailableTimezones(showOnlyBusinessTimezones);
  const timezoneSelection = useTimezoneSelection(showOnlyBusinessTimezones);
  const timeRangeHook = useTimeRange();

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    try {
      if (!newTimeRange || !newTimeRange.startDate || !newTimeRange.endDate || !newTimeRange.referenceTimezone) {
        console.error('Invalid time range provided:', newTimeRange);
        return;
      }

      const referenceTimezoneChanged = newTimeRange.referenceTimezone !== timeRangeHook.timeRange.referenceTimezone;

      if (referenceTimezoneChanged) {
        // Handle timezone selection logic when reference timezone changes
        timezoneSelection.setSelectedTimezones(prev => {
          try {
            let newSelected = [...prev];

            // Always unselect the old reference timezone
            newSelected = newSelected.filter(tz => tz.id !== timeRangeHook.timeRange.referenceTimezone);

            // Always select the new reference timezone
            const referenceTimezone = availableTimezones.find(tz => tz.id === newTimeRange.referenceTimezone);
            if (referenceTimezone && !newSelected.some(tz => tz.id === newTimeRange.referenceTimezone)) {
              newSelected.push(referenceTimezone);
            }

            return newSelected;
          } catch (error) {
            console.error('Error updating timezone selection:', error);
            return prev; // Return previous state on error
          }
        });
      }

      timeRangeHook.handleTimeRangeChange(newTimeRange);
    } catch (error) {
      console.error('Error handling time range change:', error);
    }
  };

  return (
    <TimezoneGanttView
      selectedTimezones={timezoneSelection.selectedTimezones}
      availableTimezones={availableTimezones}
      sortedTimezones={timezoneSelection.sortedTimezones}
      timeRange={timeRangeHook.timeRange}
      showOnlyBusinessTimezones={showOnlyBusinessTimezones}
      onTimezoneToggle={timezoneSelection.handleTimezoneToggle}
      onTimeRangeChange={handleTimeRangeChange}
      onShowOnlyBusinessTimezonesChange={setShowOnlyBusinessTimezones}
    />
  );
}

export default TimezoneGantt;