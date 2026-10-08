/**
 * Splits text into its whitespace-separated words.
 *
 * @param text - The text to split.
 * @returns The words, in order.
 */
export function splitWords(text: string): string[] {
  // Split on whitespace runs, dropping the empty strings left by
  // leading and trailing whitespace.
  return text.split(/\s+/).filter((word) => word.length > 0);
}
