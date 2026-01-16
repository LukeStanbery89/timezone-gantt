import React from 'react';
import { TimezoneDisplay } from '@/types';

interface TimezoneSelectProps {
  label: string;
  value: string;
  options: TimezoneDisplay[];
  onChange: (timezoneId: string) => void;
  disabled?: boolean;
  error?: string;
}

function TimezoneSelect({ label, value, options, onChange, disabled, error }: TimezoneSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="timezone-select">
      <label htmlFor={`timezone-select-${label.toLowerCase().replace(' ', '-')}`}>
        {label}:
      </label>
      <select
        id={`timezone-select-${label.toLowerCase().replace(' ', '-')}`}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        aria-describedby={error ? `timezone-error-${label.toLowerCase().replace(' ', '-')}` : undefined}
      >
        {options.map(timezone => (
          <option key={timezone.id} value={timezone.id}>
            {timezone.name} ({timezone.abbreviation})
          </option>
        ))}
      </select>
      {error && (
        <div
          id={`timezone-error-${label.toLowerCase().replace(' ', '-')}`}
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default TimezoneSelect;