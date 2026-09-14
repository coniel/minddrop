import {
  PropertyFilterDateValue,
  PropertyFilterRelativeRangeDirection,
} from '../../types';
import { resolveRelativeDate } from '../resolveRelativeDate';

/**
 * Resolves a filter date value to the epoch millisecond range of
 * the local days it covers. The start is inclusive and the end
 * exclusive. Relative ranges count from the current day, which is
 * always included.
 *
 * @param value - The date value to resolve.
 * @param now - The reference date for relative values, defaults to the current time.
 *
 * @returns The start and end of the covered range in epoch milliseconds.
 */
export function resolvePropertyFilterDateRange(
  value: PropertyFilterDateValue,
  now: Date = new Date(),
): { start: number; end: number } {
  // Multi-day ranges are counted from the current day
  if (value.type === 'relative-range') {
    return resolveRelativeRange(value.days, value.direction, now);
  }

  // The start of the target day
  let dayStart: Date;

  // Resolve the target day from the preset or absolute date
  if (value.type === 'relative') {
    dayStart = resolveRelativeDate(value.preset, now);
  } else {
    dayStart = new Date(value.date);
    dayStart.setHours(0, 0, 0, 0);
  }

  // End the range at the start of the following day
  const dayEnd = new Date(dayStart);

  // Advance to the next day
  dayEnd.setDate(dayEnd.getDate() + 1);

  return { start: dayStart.getTime(), end: dayEnd.getTime() };
}

/**
 * Resolves a day count and direction to the epoch millisecond
 * range spanning that many days, counting from the reference
 * date's day (included) into the past or future.
 */
function resolveRelativeRange(
  days: number,
  direction: PropertyFilterRelativeRangeDirection,
  now: Date,
): { start: number; end: number } {
  // Guard against non-positive counts from cleared inputs
  const dayCount = Math.max(1, Math.round(days));

  // The start of the reference date's day
  const dayStart = new Date(now);

  // Truncate to the start of the day
  dayStart.setHours(0, 0, 0, 0);

  // Start both bounds at that day
  const start = new Date(dayStart);
  const end = new Date(dayStart);

  if (direction === 'past') {
    // Count back over the current day and the days before it
    start.setDate(start.getDate() - (dayCount - 1));
    end.setDate(end.getDate() + 1);
  } else {
    // Count forward from the current day
    end.setDate(end.getDate() + dayCount);
  }

  return { start: start.getTime(), end: end.getTime() };
}
