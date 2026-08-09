import { QueryRelativeDatePreset } from '../../types';

/**
 * Resolves a relative date preset to the start of the target
 * day in local time.
 *
 * @param preset - The relative date preset to resolve.
 * @param now - The reference date, defaults to the current time.
 *
 * @returns The start of the resolved day.
 */
export function resolveRelativeDate(
  preset: QueryRelativeDatePreset,
  now: Date = new Date(),
): Date {
  const date = new Date(now);

  // Shift the date by the preset's offset
  switch (preset) {
    case 'yesterday':
      date.setDate(date.getDate() - 1);
      break;
    case 'tomorrow':
      date.setDate(date.getDate() + 1);
      break;
    case 'one-week-ago':
      date.setDate(date.getDate() - 7);
      break;
    case 'one-week-from-now':
      date.setDate(date.getDate() + 7);
      break;
    case 'one-month-ago':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'one-month-from-now':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      break;
  }

  // Truncate to the start of the local day
  date.setHours(0, 0, 0, 0);

  return date;
}
