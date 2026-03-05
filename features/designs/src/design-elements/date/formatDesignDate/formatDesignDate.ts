import { DateFormat } from '@minddrop/designs';

// Default format used when no format options are provided
const DefaultDateFormat: DateFormat = {
  mode: 'date',
  dateStyle: 'medium',
  showTime: false,
};

/**
 * Returns a relative date string (e.g. "2 days ago", "yesterday",
 * "in 3 hours") using the user's locale.
 */
function getRelativeString(
  date: Date,
  now: Date,
  locale?: string,
): string | null {
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs > 0;

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (seconds < 60) {
    return isPast ? 'just now' : 'just now';
  } else if (minutes < 60) {
    value = minutes;
    unit = 'minute';
  } else if (hours < 24) {
    value = hours;
    unit = 'hour';
  } else if (days < 7) {
    value = days;
    unit = 'day';
  } else if (weeks < 5) {
    value = weeks;
    unit = 'week';
  } else if (months < 12) {
    value = months;
    unit = 'month';
  } else {
    value = years;
    unit = 'year';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  return rtf.format(isPast ? -value : value, unit);
}

/**
 * Builds Intl.DateTimeFormat options from a dateStyle preset.
 */
function buildDateOptions(
  dateStyle: DateFormat['dateStyle'],
): Intl.DateTimeFormatOptions {
  switch (dateStyle) {
    case 'compact':
      return { day: 'numeric', month: 'numeric', year: '2-digit' };
    case 'short':
      return { day: '2-digit', month: '2-digit', year: 'numeric' };
    case 'medium':
      return { day: 'numeric', month: 'short', year: 'numeric' };
    case 'long':
      return { day: 'numeric', month: 'long', year: 'numeric' };
    case 'full':
      return {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
  }
}

/**
 * Formats a Date object according to the given DateFormat options.
 * Uses the user's locale by default. When mode is 'relative',
 * returns a relative date string instead of an absolute one.
 *
 * @param date - The date to format.
 * @param format - Optional formatting options.
 * @param now - Optional reference date for relative formatting (defaults to current time).
 * @param locale - Optional locale override (defaults to user's locale).
 * @returns The formatted date string.
 */
export function formatDesignDate(
  date: Date,
  format?: Partial<DateFormat>,
  now?: Date,
  locale?: string,
): string {
  const resolved = { ...DefaultDateFormat, ...format };

  // Use relative formatting when mode is 'relative'
  if (resolved.mode === 'relative') {
    const reference = now || new Date();
    const relative = getRelativeString(date, reference, locale);

    if (relative) {
      return relative;
    }
  }

  // Build Intl.DateTimeFormat options from the dateStyle preset
  const options: Intl.DateTimeFormatOptions = buildDateOptions(
    resolved.dateStyle,
  );

  // Add time if enabled
  if (resolved.showTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}
