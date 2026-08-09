/**
 * Escapes the `%`, `_`, and `\` LIKE wildcard characters in a
 * value so it can be used as a literal match inside a LIKE
 * pattern with `ESCAPE '\'`.
 *
 * @param value - The value to escape.
 *
 * @returns The escaped value.
 */
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
