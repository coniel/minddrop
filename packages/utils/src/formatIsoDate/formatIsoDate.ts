/**
 * Formats a Date object as an ISO date string (YYYY-MM-DD) using
 * its local date parts. Unlike `toISOString`, the date is not
 * converted to UTC, so the calendar day is preserved regardless
 * of timezone.
 */
export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
