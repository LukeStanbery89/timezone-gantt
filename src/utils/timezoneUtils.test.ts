import { describe, it, expect } from 'vitest';
import { getPopularTimezones } from '../utils/timezoneUtils';

describe('timezoneUtils', () => {
  describe('getPopularTimezones', () => {
    it('should return an array of timezones', () => {
      const timezones = getPopularTimezones();

      expect(Array.isArray(timezones)).toBe(true);
      expect(timezones.length).toBeGreaterThan(0);

      // Check that each timezone has the required properties
      timezones.forEach(timezone => {
        expect(timezone).toHaveProperty('id');
        expect(timezone).toHaveProperty('name');
        expect(timezone).toHaveProperty('offset');
        expect(timezone).toHaveProperty('abbreviation');
        expect(typeof timezone.id).toBe('string');
        expect(typeof timezone.name).toBe('string');
        expect(typeof timezone.offset).toBe('number');
        expect(typeof timezone.abbreviation).toBe('string');
      });
    });

    it('should include major world timezones', () => {
      const timezones = getPopularTimezones();
      const timezoneIds = timezones.map(tz => tz.id);

      expect(timezoneIds).toContain('America/New_York');
      expect(timezoneIds).toContain('Europe/London');
      expect(timezoneIds).toContain('Asia/Tokyo');
    });
  });
});