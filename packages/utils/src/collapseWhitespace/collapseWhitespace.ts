/**
 * Collapses text onto a single line. Runs of whitespace, line breaks
 * included, become one space, and the ends are trimmed.
 *
 * @param text - The text to collapse.
 * @returns The collapsed text.
 */
export function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}
