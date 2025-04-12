/**
 * Checks if a string is a valid URL.
 *
 * @param - url - The string to check.
 * @returns True if the string is a valid URL, false otherwise.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch (_) {
    return false;
  }
}
