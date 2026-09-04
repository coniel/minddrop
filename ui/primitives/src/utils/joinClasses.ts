/**
 * Joins class names into a single className string, dropping empty
 * and conditional falsy values.
 *
 * @param classes - The class names to join.
 * @returns The joined className string.
 */
export function joinClasses(
  ...classes: (string | false | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}
