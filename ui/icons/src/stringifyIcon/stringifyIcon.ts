import { BuiltInContentIconSetId } from '../constants';
import { ContentIconBackground, UserIcon } from '../types';

/**
 * Stringifies a UserIcon into a string representation.
 *
 * @param icon - The UserIcon to stringify.
 * @returns The string representation of the icon.
 */
export function stringifyIcon(icon: UserIcon): string {
  const background = stringifyBackground(icon);

  // Icons from other sets carry the set as an extra segment
  if (icon.set !== BuiltInContentIconSetId) {
    return `${icon.type}:${icon.set}:${icon.icon}:${icon.color}${background}`;
  }

  // Built-in set icons stay in their unqualified form
  return `${icon.type}:${icon.icon}:${icon.color}${background}`;
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
