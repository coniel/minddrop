import { ContentIconBackground, UserIcon } from '../types';

/**
 * Stringifies a UserIcon into a string representation.
 *
 * @param icon - The UserIcon to stringify.
 * @returns The string representation of the icon.
 */
export function stringifyIcon(icon: UserIcon): string {
  return `${icon.set}:${icon.icon}:${icon.color}${stringifyBackground(icon)}`;
}

/**
 * Builds the trailing background segment, which the default
 * background leaves out.
 */
function stringifyBackground(icon: UserIcon): string {
  if (
    icon.background === undefined ||
    icon.background === ContentIconBackground.None
  ) {
    return '';
  }

  return `:${icon.background}`;
}
