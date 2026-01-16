import { useState } from 'react';

import { TimezoneDisplay, TimeRange } from '@/types';
import { getUserTimezone, getAllTimezones } from '@/utils/timezoneUtils';
import { useCurrentTime } from '@/hooks/useCurrentTime';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeInput from './TimeRangeInput';
import TimezoneTimeline from './TimezoneTimeline';

import './TimezoneGantt.css';

function TimezoneGantt() {
  const currentTime = useCurrentTime();
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneDisplay[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    const userTimezone = getUserTimezone();

    // Round current time up to nearest hour
    const startTime = new Date(currentTime);
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

  // Initialize with user's timezone selected
  useState(() => {
    const userTimezone = getUserTimezone();
    setSelectedTimezones([userTimezone]);
  });



  const handleTimezoneToggle = (timezone: TimezoneDisplay) => {
    setSelectedTimezones(prev => {
      const exists = prev.find(tz => tz.id === timezone.id);
      if (exists) {
        return prev.filter(tz => tz.id !== timezone.id);
      } else {
        return [...prev, timezone];
      }
    });
  };

  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  const availableTimezones = getAllTimezones();
  const sortedTimezones = [...selectedTimezones].sort((a, b) => a.offset - b.offset);

  return (
    <div className="timezone-gantt">
      <div className="main-content">
        <div className="sidebar">
          <TimezoneSelector
            availableTimezones={availableTimezones}
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={handleTimezoneToggle}
          />
        </div>
        <div className="main-panel">
          <TimeRangeInput
            value={timeRange}
            referenceTimezones={availableTimezones}
            onChange={handleTimeRangeChange}
          />
          <div className="timeline-container">
            <TimezoneTimeline
              timezones={sortedTimezones}
              timeRange={timeRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimezoneGantt;