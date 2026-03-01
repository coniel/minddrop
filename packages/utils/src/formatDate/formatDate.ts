/**
 * Formats a Date object into a short human-readable string.
 *
 * TODO: Use the user's locale.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
