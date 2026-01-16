import { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTimezones = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableTimezones;
    }

    const query = searchQuery.toLowerCase();
    return availableTimezones.filter(timezone =>
      timezone.name.toLowerCase().includes(query)
    );
  }, [availableTimezones, searchQuery]);

  return (
    <div className="timezone-selector">
      <h3>Select Timezones</h3>
      <div className="timezone-search">
        <input
          type="text"
          placeholder="Search timezones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="timezone-grid">
        {filteredTimezones.map(timezone => {
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