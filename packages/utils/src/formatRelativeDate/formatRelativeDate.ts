// The units a difference is formatted in, from the shortest, each
// with its length in milliseconds.
const Units: [Intl.RelativeTimeFormatUnit, number][] = [
  ['minute', 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['year', 365 * 24 * 60 * 60 * 1000],
];

/**
 * Formats a date relative to now in the largest unit the difference
 * fills. A difference under a minute is formatted as "now".
 *
 * @param date - The date to format.
 * @param now - The date to measure from. The current time when omitted.
 * @returns The relative date.
 */
export function formatRelativeDate(date: Date, now?: Date): string {
  // Default the reference to the current time
  const reference = now ?? new Date();
  // Measure the signed difference and its distance
  const difference = date.getTime() - reference.getTime();
  const distance = Math.abs(difference);
  // Create the formatter
  const format = new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' });

  // Format a difference under the shortest unit as now
  if (distance < Units[0][1]) {
    return format.format(0, 'second');
  }

  // Resolve the largest unit the difference fills
  const [unit, length] = Units.reduce(
    (fitting, candidate) => (candidate[1] <= distance ? candidate : fitting),
    Units[0],
  );

  // Count the whole units
  const count = Math.floor(distance / length);

  // Format the count, negated for a date in the past
  return format.format(difference < 0 ? -count : count, unit);
}
