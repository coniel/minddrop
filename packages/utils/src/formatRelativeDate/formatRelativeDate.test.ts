import { describe, expect, it } from 'vitest';
import { formatRelativeDate } from './formatRelativeDate';

// The time the dates are measured from
const now = new Date('2025-06-15T12:00:00.000Z');

/**
 * Builds a date the given milliseconds before now.
 *
 * @param milliseconds - The distance before now.
 * @returns The date.
 */
function before(milliseconds: number) {
  return new Date(now.getTime() - milliseconds);
}

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

describe('formatRelativeDate', () => {
  it('formats a difference under a minute as now', () => {
    expect(formatRelativeDate(before(30 * 1000), now)).toBe('now');
  });

  it('counts a whole minute rather than formatting it as now', () => {
    expect(formatRelativeDate(before(minute), now)).toBe('1 minute ago');
  });

  it('counts minutes under an hour', () => {
    expect(formatRelativeDate(before(5 * minute), now)).toBe('5 minutes ago');
  });

  it('counts hours under a day', () => {
    expect(formatRelativeDate(before(3 * hour), now)).toBe('3 hours ago');
  });

  it('counts days under a week', () => {
    expect(formatRelativeDate(before(2 * day), now)).toBe('2 days ago');
  });

  it('names the previous day', () => {
    expect(formatRelativeDate(before(day), now)).toBe('yesterday');
  });

  it('moves to weeks at a whole week', () => {
    expect(formatRelativeDate(before(7 * day), now)).toBe('last week');
  });

  it('counts weeks under a month', () => {
    expect(formatRelativeDate(before(14 * day), now)).toBe('2 weeks ago');
  });

  it('counts months under a year', () => {
    expect(formatRelativeDate(before(90 * day), now)).toBe('3 months ago');
  });

  it('counts years past a year', () => {
    expect(formatRelativeDate(before(800 * day), now)).toBe('2 years ago');
  });

  it('formats a later date as ahead', () => {
    expect(formatRelativeDate(new Date(now.getTime() + 3 * hour), now)).toBe(
      'in 3 hours',
    );
  });

  it('measures from the current time by default', () => {
    expect(formatRelativeDate(new Date())).toBe('now');
  });
});
