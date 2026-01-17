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
    <div className="border border-gray-200 rounded-lg bg-white p-5">
      <div className="flex justify-between items-center mb-5 text-gray-800 text-[1.2rem] border-b border-gray-200 pb-2.5">
        <h3 className="m-0">Time Range</h3>
        <button
          className="bg-transparent border-none text-[1.2rem] cursor-pointer text-gray-600 p-1 px-2 rounded hover:bg-gray-100 hover:text-gray-800"
          onClick={() => setIsSettingsModalOpen(true)}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex gap-[30px] flex-col md:flex-row">
          <div className="flex-1">
            <h4 className="m-0 mb-2.5 text-gray-800 text-[1rem]">Start Time</h4>
            <div className="flex gap-[15px] items-center flex-col md:flex-row">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="start-date" className="font-medium text-gray-700 text-[0.85rem]">Date:</label>
                <input
                  id="start-date"
                  type="date"
                  value={formatDateForInput(value.startDate)}
                  onChange={handleStartDateChange}
                  className="p-2 px-2.5 border border-gray-300 rounded text-[0.9rem] w-[130px]"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="start-time" className="font-medium text-gray-700 text-[0.85rem]">Time:</label>
                 <input
                   id="start-time"
                   type="time"
                   value={formatTimeForInput(value.startDate)}
                   onChange={handleStartTimeChange}
                   className="p-2 px-2.5 border border-gray-300 rounded text-[0.9rem] w-[140px]"
                 />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h4 className="m-0 mb-2.5 text-gray-800 text-[1rem]">End Time</h4>
            <div className="flex gap-[15px] items-center flex-col md:flex-row">
              <div className="flex flex-col gap-1.25">
                <label htmlFor="end-date" className="font-medium text-gray-700 text-[0.85rem]">Date:</label>
                <input
                  id="end-date"
                  type="date"
                  value={formatDateForInput(value.endDate)}
                  onChange={handleEndDateChange}
                  className="p-2 px-2.5 border border-gray-300 rounded text-[0.9rem] w-[130px]"
                />
              </div>
              <div className="flex flex-col gap-1.25">
                <label htmlFor="end-time" className="font-medium text-gray-700 text-[0.85rem]">Time:</label>
                 <input
                   id="end-time"
                   type="time"
                   value={formatTimeForInput(value.endDate)}
                   onChange={handleEndTimeChange}
                   className="p-2 px-2.5 border border-gray-300 rounded text-[0.9rem] w-[140px]"
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
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="modal-reference-timezone" className="font-medium text-gray-700 text-[0.9rem]">My Timezone:</label>
            <select
              id="modal-reference-timezone"
              value={value.referenceTimezone}
              onChange={handleReferenceTimezoneChange}
              className="p-2 px-3 border border-gray-300 rounded text-[0.9rem] bg-white max-w-[300px]"
            >
              {referenceTimezones.map(timezone => (
                <option key={timezone.id} value={timezone.id}>
                  {timezone.name} ({timezone.abbreviation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showOnlyBusinessTimezones}
                onChange={(e) => onShowOnlyBusinessTimezonesChange(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
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