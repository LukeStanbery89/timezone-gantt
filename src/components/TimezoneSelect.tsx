import React, { useCallback, useMemo } from 'react';
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
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const errorId = useMemo(() => `timezone-error-${label.toLowerCase().replace(' ', '-')}`, [label]);

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
        aria-describedby={error ? errorId : `${label.toLowerCase().replace(' ', '-')}-select-help`}
        aria-invalid={!!error}
        required
      >
        <option value="">Select a timezone...</option>
        {options.map(timezone => (
          <option key={timezone.id} value={timezone.id}>
            {timezone.name} ({timezone.abbreviation})
          </option>
        ))}
      </select>
      <div id={`${label.toLowerCase().replace(' ', '-')}-select-help`} className="sr-only">
        Choose your {label.toLowerCase()} from the available options
      </div>
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

export default TimezoneSelect;