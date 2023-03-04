/**
 * Turns camelCase strings into kebab-case.
 */
export function toKebabCase(string: string): string {
  return string.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );
}
