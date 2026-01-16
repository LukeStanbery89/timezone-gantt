export interface TimezoneDisplay {
  id: string;           // IANA timezone identifier (e.g., "America/New_York")
  name: string;         // Display name (e.g., "Eastern Time")
  offset: number;       // Offset from UTC in minutes
  abbreviation: string; // Current abbreviation (e.g., "EST", "EDT")
  isSelected?: boolean; // Whether this timezone is currently selected
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress?: number;
  type?: 'task' | 'milestone' | 'project';
  dependencies?: string[];
}

export interface TimezoneConfig {
  selectedTimezones: TimezoneDisplay[];
  referenceTime: Date;  // Current time or user-input time
  timelineStart: Date;  // Start of 24-hour view
  timelineEnd: Date;    // End of 24-hour view
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
  referenceTimezone: string;
}

export interface TimeInputValue {
  hours: number;
  minutes: number;
  date: Date;
}