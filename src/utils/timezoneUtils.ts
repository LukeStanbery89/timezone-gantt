
import { formatInTimeZone, getTimezoneOffset } from 'date-fns-tz';
import { TimezoneDisplay, GanttTask } from '@/types';

/**
 * Get the user's current timezone
 */
export function getUserTimezone(): TimezoneDisplay {
  const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    id: timezoneId,
    name: getTimezoneDisplayName(timezoneId),
    offset: getTimezoneOffset(timezoneId),
    abbreviation: getTimezoneAbbreviation(timezoneId),
  };
}

/**
 * Get a human-readable name for a timezone
 */
export function getTimezoneDisplayName(timezoneId: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneId,
      timeZoneName: 'long',
    });
    const parts = formatter.formatToParts(now);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value;
    return timeZoneName || timezoneId;
  } catch {
    return timezoneId;
  }
}

/**
 * Get the current timezone abbreviation (EST, PST, etc.)
 */
export function getTimezoneAbbreviation(timezoneId: string): string {
  try {
    const now = new Date();
    return formatInTimeZone(now, timezoneId, 'zzz');
  } catch {
    return 'UTC';
  }
}

/**
 * Get a list of popular timezones
 */
export function getPopularTimezones(): TimezoneDisplay[] {
  const timezones = [
    'America/New_York',     // Eastern Time
    'America/Chicago',      // Central Time
    'America/Denver',       // Mountain Time
    'America/Los_Angeles',  // Pacific Time
    'Europe/London',        // GMT/BST
    'Europe/Paris',         // CET/CEST
    'Europe/Berlin',        // CET/CEST
    'Asia/Tokyo',           // JST
    'Asia/Shanghai',        // CST
    'Asia/Kolkata',         // IST
    'Australia/Sydney',     // AEST/AEDT
    'Pacific/Auckland',     // NZST/NZDT
  ];

  return timezones.map(id => ({
    id,
    name: getTimezoneDisplayName(id),
    offset: getTimezoneOffset(id),
    abbreviation: getTimezoneAbbreviation(id),
  }));
}

/**
 * Convert a time from one timezone to another
 */
export function convertTime(
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date {
  const utcTime = new Date(date.getTime() - getTimezoneOffset(fromTimezone));
  return new Date(utcTime.getTime() + getTimezoneOffset(toTimezone));
}

/**
 * Create gantt tasks for timezone visualization
 */
export function createTimezoneTasks(
  timezones: TimezoneDisplay[],
  referenceTime: Date
): GanttTask[] {
  const tasks: GanttTask[] = [];

  timezones.forEach((timezone) => {
    // Create a task representing the current time period in this timezone
    const currentTimeInTimezone = convertTime(referenceTime, 'UTC', timezone.id);
    const taskStart = new Date(currentTimeInTimezone.getTime() - 30 * 60 * 1000); // 30 minutes before
    const taskEnd = new Date(currentTimeInTimezone.getTime() + 30 * 60 * 1000); // 30 minutes after

    tasks.push({
      id: `timezone-${timezone.id}`,
      name: `${timezone.name} (${timezone.abbreviation})`,
      start: taskStart,
      end: taskEnd,
      progress: 100,
      type: 'task',
    });
  });

  return tasks;
}

/**
 * Format time for display in a specific timezone
 */
export function formatTimeInTimezone(
  date: Date,
  timezoneId: string,
  formatString: string = 'HH:mm'
): string {
  return formatInTimeZone(date, timezoneId, formatString);
}