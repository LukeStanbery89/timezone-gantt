import React, { useState } from 'react';
import { formatDateForInput, formatTimeForInput, parseTimeInput, combineDateAndTime } from '@/utils/dateTimeUtils';

interface DateTimeInputProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  timezoneId?: string;
  error?: string;
}

function DateTimeInput({ label, date, onDateChange, timezoneId, error }: DateTimeInputProps) {
  const [dateValue, setDateValue] = useState(formatDateForInput(date));
  const [timeValue, setTimeValue] = useState(formatTimeForInput(date));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value;
    setDateValue(newDateValue);

    const combined = combineDateAndTime(newDateValue, timeValue);
    if (combined) {
      onDateChange(combined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeValue = e.target.value;
    setTimeValue(newTimeValue);

    const time = parseTimeInput(newTimeValue);
    if (time) {
      const combined = combineDateAndTime(dateValue, newTimeValue);
      if (combined) {
        onDateChange(combined);
      }
    }
  };

  return (
    <div className="datetime-input">
      <h4>{label}</h4>
      <div className="input-row">
        <div className="date-input">
          <label htmlFor={`${label.toLowerCase().replace(' ', '-')}-date`}>Date:</label>
          <input
            id={`${label.toLowerCase().replace(' ', '-')}-date`}
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            aria-describedby={error ? `${label.toLowerCase().replace(' ', '-')}-error` : undefined}
          />
        </div>
        <div className="time-input">
          <label htmlFor={`${label.toLowerCase().replace(' ', '-')}-time`}>Time:</label>
          <input
            id={`${label.toLowerCase().replace(' ', '-')}-time`}
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            aria-describedby={error ? `${label.toLowerCase().replace(' ', '-')}-error` : undefined}
          />
        </div>
      </div>
      {timezoneId && (
        <div className="timezone-display">
          Timezone: {timezoneId}
        </div>
      )}
      {error && (
        <div
          id={`${label.toLowerCase().replace(' ', '-')}-error`}
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default DateTimeInput;