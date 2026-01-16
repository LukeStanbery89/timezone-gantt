
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
 * Get the IANA timezone identifier for display
 */
export function getTimezoneDisplayName(timezoneId: string): string {
  return timezoneId;
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
 * Get all available timezones, with business timezones marked
 */
export function getAllTimezones(): TimezoneDisplay[] {
  // Common business timezones (major cities, financial centers) - these will be marked as business zones
  const businessTimezoneIds = new Set([
    'America/New_York',     // Eastern Time - major US business hub
    'America/Chicago',      // Central Time - Chicago financial markets
    'America/Denver',       // Mountain Time
    'America/Los_Angeles',  // Pacific Time - Silicon Valley, Hollywood
    'America/Toronto',      // Toronto business hub
    'America/Vancouver',    // Vancouver business hub
    'Europe/London',        // GMT/BST - London financial markets
    'Europe/Paris',         // CET/CEST - Paris business hub
    'Europe/Berlin',        // CET/CEST - Berlin business hub
    'Europe/Zurich',        // Zurich financial center
    'Europe/Amsterdam',     // Amsterdam financial center
    'Asia/Tokyo',           // JST - Tokyo stock exchange
    'Asia/Shanghai',        // CST - Shanghai financial markets
    'Asia/Hong_Kong',       // Hong Kong financial markets
    'Asia/Singapore',       // Singapore financial hub
    'Asia/Kolkata',         // IST - Mumbai financial markets
    'Australia/Sydney',     // AEST/AEDT - Sydney financial markets
    'Pacific/Auckland',     // NZST/NZDT - Auckland business hub
  ]);

  // Comprehensive timezone list (organized by region) - includes business zones
  const allTimezoneIds = [
    // North America
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'America/Halifax',
    'America/Anchorage',

    // Europe
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/Amsterdam',
    'Europe/Zurich',
    'Europe/Stockholm',
    'Europe/Moscow',
    'Europe/Istanbul',
    'Europe/Athens',
    'Europe/Dublin',
    'Europe/Prague',
    'Europe/Vienna',

    // Asia
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Seoul',
    'Asia/Bangkok',
    'Asia/Manila',
    'Asia/Kuala_Lumpur',
    'Asia/Jakarta',
    'Asia/Karachi',
    'Asia/Taipei',
    'Asia/Tehran',
    'Asia/Jerusalem',

    // Oceania
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Perth',
    'Australia/Brisbane',
    'Pacific/Auckland',
    'Pacific/Honolulu',

    // Africa
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',
    'Africa/Casablanca',

    // South America
    'America/Santiago',
    'America/Lima',
    'America/Bogota',
    'America/Caracas',

    // UTC and special
    'UTC',
    'GMT',
  ];

  // Remove duplicates and create timezone objects
  const uniqueTimezoneIds = [...new Set(allTimezoneIds)];

  return uniqueTimezoneIds.map(id => ({
    id,
    name: getTimezoneDisplayName(id),
    offset: getTimezoneOffset(id),
    abbreviation: getTimezoneAbbreviation(id),
    isBusiness: businessTimezoneIds.has(id),
  }));
}

/**
 * Get a list of popular timezones (legacy function for backward compatibility)
 */
export function getPopularTimezones(): TimezoneDisplay[] {
  return getAllTimezones().filter(tz => tz.isBusiness);
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