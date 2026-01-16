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
    <div>
      <h3 className="mx-[15px] mb-2.5 mt-[15px] text-gray-800 text-[1.2rem] border-b border-gray-200 pb-2.5">Select Timezones</h3>
      <div className="mx-[15px] mb-[15px]">
        <input
          type="text"
          placeholder="Search timezones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full box-border p-2 px-3 border border-gray-300 rounded text-[0.9rem] bg-white focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
        />
      </div>
      <div className="p-0 px-[15px] pb-[15px]">
        {filteredTimezones.map(timezone => {
          const isSelected = selectedTimezones.some(tz => tz.id === timezone.id);

          return (
            <label key={timezone.id} className="flex items-center gap-2.5 p-2 px-3 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer transition-colors mb-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTimezoneToggle(timezone)}
                className="m-0 w-4 h-4"
              />
               <div className="flex-1 flex flex-col gap-0.5">
                 <span className={`font-medium text-gray-800 text-[0.9rem] ${timezone.isBusiness ? 'font-bold' : ''}`}>{timezone.name}</span>
                 <span className="text-gray-600 text-[0.8rem] mt-px">
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