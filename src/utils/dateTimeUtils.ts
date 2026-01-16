import { formatInTimeZone } from 'date-fns-tz';

/**
 * Utility functions for date and time formatting and validation
 */

/**
 * Format a date for HTML date input (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format a time for HTML time input (HH:MM)
 */
export const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

/**
 * Parse and validate a time input string (HH:MM)
 * Returns the parsed hours and minutes, or null if invalid
 */
export const parseTimeInput = (timeValue: string): { hours: number; minutes: number } | null => {
  if (!timeValue?.includes(':')) return null;

  const [hours, minutes] = timeValue.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
};

/**
 * Create a Date object from separate date and time strings
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): Date | null => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  const time = parseTimeInput(timeStr);
  if (!time) return null;

  date.setHours(time.hours, time.minutes, 0, 0);
  return date;
};

/**
 * Validate that an end date/time is after a start date/time
 */
export const validateTimeRange = (startDate: Date, endDate: Date): boolean => {
  return endDate.getTime() > startDate.getTime();
};

/**
 * Format time for display in a specific timezone
 */
export const formatTimeForDisplay = (
  date: Date,
  timezoneId: string,
  format: string = 'h:mm a'
): string => {
  return formatInTimeZone(date, timezoneId, format);
};