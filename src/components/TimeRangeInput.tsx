import React from 'react';
import { TimeRange, TimezoneDisplay } from '@/types';

interface TimeRangeInputProps {
  value: TimeRange;
  referenceTimezones: TimezoneDisplay[];
  onChange: (value: TimeRange) => void;
}

function TimeRangeInput({ value, referenceTimezones, onChange }: TimeRangeInputProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      // Preserve the current start time when changing date
      const newStartDate = new Date(date);
      newStartDate.setHours(value.startDate.getHours(), value.startDate.getMinutes(), 0, 0);
      onChange({ ...value, startDate: newStartDate });
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (!timeValue || !timeValue.includes(':')) return;

    const [hours, minutes] = timeValue.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return;

    const newStartDate = new Date(value.startDate);
    newStartDate.setHours(hours, minutes, 0, 0);
    onChange({ ...value, startDate: newStartDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      // Preserve the current end time when changing date
      const newEndDate = new Date(date);
      newEndDate.setHours(value.endDate.getHours(), value.endDate.getMinutes(), 0, 0);
      onChange({ ...value, endDate: newEndDate });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (!timeValue || !timeValue.includes(':')) return;

    const [hours, minutes] = timeValue.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return;

    const newEndDate = new Date(value.endDate);
    newEndDate.setHours(hours, minutes, 0, 0);
    onChange({ ...value, endDate: newEndDate });
  };

  const handleReferenceTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, referenceTimezone: e.target.value });
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().slice(0, 5);
  };

  return (
    <div className="time-range-input">
      <h3>Time Range</h3>

      <div className="time-range-controls">
        <div className="time-range-row">
          <div className="time-input-group">
            <h4>Start Time</h4>
            <div className="input-row">
              <div className="date-input">
                <label htmlFor="start-date">Date:</label>
                <input
                  id="start-date"
                  type="date"
                  value={formatDateForInput(value.startDate)}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="time-input">
                <label htmlFor="start-time">Time:</label>
                <input
                  id="start-time"
                  type="time"
                  value={formatTimeForInput(value.startDate)}
                  onChange={handleStartTimeChange}
                />
              </div>
            </div>
          </div>

          <div className="time-input-group">
            <h4>End Time</h4>
            <div className="input-row">
              <div className="date-input">
                <label htmlFor="end-date">Date:</label>
                <input
                  id="end-date"
                  type="date"
                  value={formatDateForInput(value.endDate)}
                  onChange={handleEndDateChange}
                />
              </div>
              <div className="time-input">
                <label htmlFor="end-time">Time:</label>
                <input
                  id="end-time"
                  type="time"
                  value={formatTimeForInput(value.endDate)}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>
          </div>

          <div className="reference-timezone">
            <label htmlFor="reference-timezone">Reference Timezone:</label>
            <select
              id="reference-timezone"
              value={value.referenceTimezone}
              onChange={handleReferenceTimezoneChange}
            >
              {referenceTimezones.map(timezone => (
                <option key={timezone.id} value={timezone.id}>
                  {timezone.name} ({timezone.abbreviation})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeRangeInput;