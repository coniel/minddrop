/**
 * Turns camelCase strings into kebab-case.
 */
export function camelToKebab(string: string): string {
  return string.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );
}
