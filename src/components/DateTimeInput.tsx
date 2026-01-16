import React, { useCallback, useMemo } from 'react';
import { formatDateForInput, formatTimeForInput, parseTimeInput, combineDateAndTime } from '@/utils/dateTimeUtils';

interface DateTimeInputProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  timezoneId?: string;
  error?: string;
}

function DateTimeInput({ label, date, onDateChange, timezoneId, error }: DateTimeInputProps) {
  // Memoize formatted values to prevent unnecessary recalculations
  const dateValue = useMemo(() => formatDateForInput(date), [date]);
  const timeValue = useMemo(() => formatTimeForInput(date), [date]);
  const errorId = useMemo(() => `error-${label.toLowerCase().replace(' ', '-')}`, [label]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value;
    const combined = combineDateAndTime(newDateValue, timeValue);
    if (combined) {
      onDateChange(combined);
    }
  }, [timeValue, onDateChange]);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeValue = e.target.value;
    const time = parseTimeInput(newTimeValue);
    if (time) {
      const combined = combineDateAndTime(dateValue, newTimeValue);
      if (combined) {
        onDateChange(combined);
      }
    }
  }, [dateValue, onDateChange]);

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
            aria-describedby={error ? errorId : `${label.toLowerCase().replace(' ', '-')}-date-help`}
            aria-invalid={!!error}
            required
          />
          <div id={`${label.toLowerCase().replace(' ', '-')}-date-help`} className="sr-only">
            Select the date for {label.toLowerCase()}
          </div>
        </div>
        <div className="time-input">
          <label htmlFor={`${label.toLowerCase().replace(' ', '-')}-time`}>Time:</label>
          <input
            id={`${label.toLowerCase().replace(' ', '-')}-time`}
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
            aria-describedby={error ? errorId : `${label.toLowerCase().replace(' ', '-')}-time-help`}
            aria-invalid={!!error}
            required
          />
          <div id={`${label.toLowerCase().replace(' ', '-')}-time-help`} className="sr-only">
            Select the time for {label.toLowerCase()}
          </div>
        </div>
      </div>
      {timezoneId && (
        <div className="timezone-display" aria-live="polite">
          Timezone: {timezoneId}
        </div>
      )}
      {error && (
        <div
          id={errorId}
          className="error-message"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default DateTimeInput;