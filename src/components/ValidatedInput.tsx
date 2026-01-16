import React, { useState, useMemo } from 'react';

interface ValidatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  validator?: (value: string) => string | null; // Returns error message or null if valid
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

function ValidatedInput({
  label,
  value,
  onChange,
  validator,
  type = 'text',
  placeholder,
  required,
  disabled
}: ValidatedInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Memoize the validation function to prevent unnecessary recalculations
  const validate = useMemo(() => (val: string) => {
    if (validator) {
      const validationError = validator(val);
      setError(validationError);
      return validationError === null;
    }
    return true;
  }, [validator]);

  // Memoize the error ID to prevent unnecessary recalculations
  const errorId = useMemo(() => `error-${label.toLowerCase().replace(' ', '-')}`, [label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (touched) {
      validate(newValue);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    validate(value);
  };

  return (
    <div className="validated-input">
      <label htmlFor={`input-${label.toLowerCase().replace(' ', '-')}`}>
        {label}{required && <span className="required">*</span>}:
      </label>
      <input
        id={`input-${label.toLowerCase().replace(' ', '-')}`}
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <div
          id={errorId}
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default ValidatedInput;