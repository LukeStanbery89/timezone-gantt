import React, { useState } from 'react';
import { TimeRange, TimezoneDisplay } from '@/types';
import Modal from './Modal';

interface TimeRangeInputProps {
  value: TimeRange;
  referenceTimezones: TimezoneDisplay[];
  onChange: (value: TimeRange) => void;
  showOnlyBusinessTimezones: boolean;
  onShowOnlyBusinessTimezonesChange: (enabled: boolean) => void;
}

function TimeRangeInput({
  value,
  referenceTimezones,
  onChange,
  showOnlyBusinessTimezones,
  onShowOnlyBusinessTimezonesChange
}: TimeRangeInputProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
      <div className="time-range-header">
        <h3>Time Range</h3>
        <button
          className="settings-button"
          onClick={() => setIsSettingsModalOpen(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

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
        </div>
      </div>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Settings"
      >
        <div className="settings-content">
          <div className="setting-group">
            <label htmlFor="modal-reference-timezone">My Timezone:</label>
            <select
              id="modal-reference-timezone"
              value={value.referenceTimezone}
              onChange={handleReferenceTimezoneChange}
              className="timezone-select"
            >
              {referenceTimezones.map(timezone => (
                <option key={timezone.id} value={timezone.id}>
                  {timezone.name} ({timezone.abbreviation})
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showOnlyBusinessTimezones}
                onChange={(e) => onShowOnlyBusinessTimezonesChange(e.target.checked)}
              />
              Show only common business timezones
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TimeRangeInput;