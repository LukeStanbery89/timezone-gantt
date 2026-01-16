
import { TimeRange, TimezoneDisplay } from '@/types';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeInput from './TimeRangeInput';
import TimezoneTimeline from './TimezoneTimeline';

import './TimezoneGantt.css';

interface TimezoneGanttViewProps {
  selectedTimezones: TimezoneDisplay[];
  availableTimezones: TimezoneDisplay[];
  sortedTimezones: TimezoneDisplay[];
  timeRange: TimeRange;
  showOnlyBusinessTimezones: boolean;
  onTimezoneToggle: (timezone: TimezoneDisplay) => void;
  onTimeRangeChange: (timeRange: TimeRange) => void;
  onShowOnlyBusinessTimezonesChange: (enabled: boolean) => void;
}

function TimezoneGanttView({
  selectedTimezones,
  availableTimezones,
  sortedTimezones,
  timeRange,
  showOnlyBusinessTimezones,
  onTimezoneToggle,
  onTimeRangeChange,
  onShowOnlyBusinessTimezonesChange,
}: TimezoneGanttViewProps) {
  return (
    <div className="timezone-gantt">
      <div className="main-content">
        <div className="sidebar">
          <TimezoneSelector
            availableTimezones={availableTimezones}
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={onTimezoneToggle}
          />
        </div>
        <div className="main-panel">
          <TimeRangeInput
            value={timeRange}
            referenceTimezones={availableTimezones}
            onChange={onTimeRangeChange}
            showOnlyBusinessTimezones={showOnlyBusinessTimezones}
            onShowOnlyBusinessTimezonesChange={onShowOnlyBusinessTimezonesChange}
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

export default TimezoneGanttView;