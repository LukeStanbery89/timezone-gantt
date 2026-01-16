import React from 'react';
import { TimeInputValue } from '@/types';

interface TimeInputProps {
  value: TimeInputValue;
  onChange: (value: TimeInputValue) => void;
}

function TimeInput({ value, onChange }: TimeInputProps) {
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hours = parseInt(e.target.value) || 0;
    onChange({ ...value, hours: Math.max(0, Math.min(23, hours)) });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 0;
    onChange({ ...value, minutes: Math.max(0, Math.min(59, minutes)) });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      // Preserve the current time when changing date
      const newDate = new Date(date);
      newDate.setHours(value.hours, value.minutes, 0, 0);
      onChange({ ...value, date: newDate });
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="time-input">
      <h3>Reference Time</h3>
      <div className="time-controls">
        <div className="date-input">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={formatDateForInput(value.date)}
            onChange={handleDateChange}
          />
        </div>
        <div className="time-input-group">
          <div className="hour-input">
            <label htmlFor="hours">Hours:</label>
            <input
              id="hours"
              type="number"
              min="0"
              max="23"
              value={value.hours}
              onChange={handleHoursChange}
            />
          </div>
          <div className="minute-input">
            <label htmlFor="minutes">Minutes:</label>
            <input
              id="minutes"
              type="number"
              min="0"
              max="59"
              value={value.minutes}
              onChange={handleMinutesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeInput;