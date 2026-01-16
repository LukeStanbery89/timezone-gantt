import { useState } from 'react';

import { TimezoneDisplay, TimeRange } from '@/types';
import { getUserTimezone, getPopularTimezones } from '@/utils/timezoneUtils';
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
    const startTime = new Date(currentTime);
    startTime.setHours(9, 0, 0, 0); // Default to 9 AM today
    const endTime = new Date(currentTime);
    endTime.setHours(17, 0, 0, 0); // Default to 5 PM today

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

  const availableTimezones = getPopularTimezones();
  const sortedTimezones = [...selectedTimezones].sort((a, b) => a.offset - b.offset);

  return (
    <div className="timezone-gantt">
      <header>
        <h1>Timezone Gantt Chart</h1>
        <p>Visualize time ranges across multiple timezones</p>
      </header>
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