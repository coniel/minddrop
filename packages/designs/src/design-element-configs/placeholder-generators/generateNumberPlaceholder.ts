/**
 * Generates a random number string with the specified number
 * of digits for use as a placeholder in number design elements.
 *
 * @param digits - The number of digits to generate.
 * @returns A string like "472".
 */
export function generateNumberPlaceholder(digits: number): string {
  if (digits <= 0) {
    return '0';
  }

  if (digits === 1) {
    return String(Math.floor(Math.random() * 9) + 1);
  }

  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
