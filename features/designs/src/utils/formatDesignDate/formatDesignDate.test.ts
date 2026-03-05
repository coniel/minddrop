import { describe, expect, it } from 'vitest';
import { formatDesignDate } from './formatDesignDate';

// Fixed date: 5 March 2026, 14:30:45 UTC
const testDate = new Date('2026-03-05T14:30:45Z');

// All tests use en-GB locale for deterministic output
const locale = 'en-GB';

describe('formatDesignDate', () => {
  describe('date styles', () => {
    it('formats with compact style', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'compact' },
        undefined,
        locale,
      );

      expect(result).toBe('05/03/26');
    });

    it('formats with short style', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'short' },
        undefined,
        locale,
      );

      expect(result).toBe('05/03/2026');
    });

    it('formats with medium style (default)', () => {
      const result = formatDesignDate(testDate, undefined, undefined, locale);

      expect(result).toBe('5 Mar 2026');
    });

    it('formats with long style', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'long' },
        undefined,
        locale,
      );

      expect(result).toBe('5 March 2026');
    });

    it('formats with full style', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'full' },
        undefined,
        locale,
      );

      expect(result).toContain('Thu');
      expect(result).toContain('5');
      expect(result).toContain('Mar');
      expect(result).toContain('2026');
    });
  });

  describe('time display', () => {
    it('includes time when showTime is true', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'medium', showTime: true },
        undefined,
        locale,
      );

      expect(result).toContain('5 Mar 2026');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('does not include time by default', () => {
      const result = formatDesignDate(testDate, undefined, undefined, locale);

      expect(result).toBe('5 Mar 2026');
    });
  });

  describe('relative mode', () => {
    it('returns "just now" for dates within the last minute', () => {
      const now = new Date('2026-03-05T14:31:00Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toBe('just now');
    });

    it('returns relative minutes', () => {
      const now = new Date('2026-03-05T14:45:00Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('minute');
    });

    it('returns relative hours', () => {
      const now = new Date('2026-03-05T17:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('hour');
    });

    it('returns relative days', () => {
      const now = new Date('2026-03-07T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('2 days ago');
    });

    it('returns "yesterday" for 1 day ago', () => {
      const now = new Date('2026-03-06T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toBe('yesterday');
    });

    it('returns "tomorrow" for 1 day in the future', () => {
      const now = new Date('2026-03-04T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toBe('tomorrow');
    });

    it('returns relative weeks', () => {
      const now = new Date('2026-03-20T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('week');
    });

    it('returns relative months', () => {
      const now = new Date('2026-06-05T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('month');
    });

    it('returns relative years', () => {
      const now = new Date('2028-03-05T14:30:45Z');
      const result = formatDesignDate(
        testDate,
        { mode: 'relative' },
        now,
        locale,
      );

      expect(result).toContain('year');
    });
  });

  describe('defaults', () => {
    it('uses medium date style with no time by default', () => {
      const result = formatDesignDate(testDate, undefined, undefined, locale);

      expect(result).toBe('5 Mar 2026');
    });

    it('accepts partial format overrides', () => {
      const result = formatDesignDate(
        testDate,
        { dateStyle: 'long' },
        undefined,
        locale,
      );

      expect(result).toBe('5 March 2026');
    });
  });
});
