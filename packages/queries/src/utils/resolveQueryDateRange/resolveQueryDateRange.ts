import { QueryDateValue } from '../../types';
import { resolveRelativeDate } from '../resolveRelativeDate';

/**
 * Resolves a query date value to the local-day epoch
 * millisecond range it covers, from the start of the day
 * (inclusive) to the start of the following day (exclusive).
 *
 * @param value - The date value to resolve.
 * @param now - The reference date for relative presets, defaults to the current time.
 *
 * @returns The start and end of the covered day in epoch milliseconds.
 */
export function resolveQueryDateRange(
  value: QueryDateValue,
  now: Date = new Date(),
): { start: number; end: number } {
  let dayStart: Date;

  // Resolve the target day from the preset or absolute date
  if (value.type === 'relative') {
    dayStart = resolveRelativeDate(value.preset, now);
  } else {
    dayStart = new Date(value.date);
    dayStart.setHours(0, 0, 0, 0);
  }

  // The range ends at the start of the following day
  const dayEnd = new Date(dayStart);

  dayEnd.setDate(dayEnd.getDate() + 1);

  return { start: dayStart.getTime(), end: dayEnd.getTime() };
}
