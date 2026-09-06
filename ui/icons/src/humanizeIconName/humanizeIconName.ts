/**
 * Formats an icon or emoji name for display by replacing hyphens
 * with spaces and capitalising the first letter.
 *
 * @param name - The icon name, e.g. `circle-chevron-down`.
 * @returns The display name, e.g. `Circle chevron down`.
 */
export function humanizeIconName(name: string): string {
  const spaced = name.replaceAll('-', ' ');

  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
