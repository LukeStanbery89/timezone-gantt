
import { TimeRange, TimezoneDisplay } from '@/types';
import TimezoneSelector from './TimezoneSelector';
import TimeRangeInput from './TimeRangeInput';
import TimezoneTimeline from './TimezoneTimeline';

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
    <div className="max-w-[1400px] mx-auto p-5 font-sans">
      <div className="flex gap-5 h-[calc(100vh-200px)] flex-col md:flex-row">
        <aside className="w-[280px] flex-shrink-0 overflow-y-auto border border-gray-200 rounded-lg bg-white p-0 md:w-full md:max-h-[300px]" role="complementary" aria-label="Timezone selection">
          <TimezoneSelector
            availableTimezones={availableTimezones}
            selectedTimezones={selectedTimezones}
            onTimezoneToggle={onTimezoneToggle}
          />
        </aside>

        <main className="flex-1 flex flex-col gap-5" role="main" aria-label="Timeline visualization">
          <TimeRangeInput
            value={timeRange}
            referenceTimezones={availableTimezones}
            onChange={onTimeRangeChange}
            showOnlyBusinessTimezones={showOnlyBusinessTimezones}
            onShowOnlyBusinessTimezonesChange={onShowOnlyBusinessTimezonesChange}
          />

          <section
            className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white min-h-[400px] flex flex-col"
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