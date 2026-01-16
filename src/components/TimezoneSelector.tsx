import { TimezoneDisplay } from '@/types';

interface TimezoneSelectorProps {
  availableTimezones: TimezoneDisplay[];
  selectedTimezones: TimezoneDisplay[];
  onTimezoneToggle: (timezone: TimezoneDisplay) => void;
}

function TimezoneSelector({
  availableTimezones,
  selectedTimezones,
  onTimezoneToggle,
}: TimezoneSelectorProps) {
  return (
    <div className="timezone-selector">
      <h3>Select Timezones</h3>
      <div className="timezone-grid">
        {availableTimezones.map(timezone => {
          const isSelected = selectedTimezones.some(tz => tz.id === timezone.id);

          return (
            <label key={timezone.id} className="timezone-option">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTimezoneToggle(timezone)}
              />
               <div className="timezone-info">
                 <span className={`timezone-name ${timezone.isBusiness ? 'business-timezone' : ''}`}>{timezone.name}</span>
                 <span className="timezone-details">
                   ({timezone.abbreviation}) UTC{timezone.offset >= 0 ? '+' : ''}{Math.round(timezone.offset / 60)}
                 </span>
               </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default TimezoneSelector;