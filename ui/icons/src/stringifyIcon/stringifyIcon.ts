import { BuiltInContentIconSetId } from '../constants';
import { UserIcon } from '../types';

/**
 * Stringifies a UserIcon into a string representation.
 *
 * @param icon - The UserIcon to stringify.
 * @returns The string representation of the icon.
 */
export function stringifyIcon(icon: UserIcon): string {
  if (icon.type === 'emoji') {
    return `${icon.type}:${icon.icon}:${icon.skinTone}`;
  }

  // Icons from other sets carry the set as an extra segment
  if (icon.set !== BuiltInContentIconSetId) {
    return `${icon.type}:${icon.set}:${icon.icon}:${icon.color}`;
  }

  // Built-in set icons stay in their unqualified form
  return `${icon.type}:${icon.icon}:${icon.color}`;
}
