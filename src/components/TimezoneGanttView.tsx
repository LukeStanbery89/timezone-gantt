
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
        <aside className="sidebar" role="complementary" aria-label="Timezone selection">
          <TimezoneSelector
            availableTimezones={availableTimezones}
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={onTimezoneToggle}
          />
        </aside>

        <main className="main-panel" role="main" aria-label="Timeline visualization">
          <TimeRangeInput
            value={timeRange}
            referenceTimezones={availableTimezones}
            onChange={onTimeRangeChange}
            showOnlyBusinessTimezones={showOnlyBusinessTimezones}
            onShowOnlyBusinessTimezonesChange={onShowOnlyBusinessTimezonesChange}
          />

          <section
            className="timeline-container"
            aria-label="Timezone timeline visualization"
            aria-live="polite"
            aria-atomic="true"
          >
            <TimezoneTimeline
              timezones={sortedTimezones}
              timeRange={timeRange}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default TimezoneGanttView;