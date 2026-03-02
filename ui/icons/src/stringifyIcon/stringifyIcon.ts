import { UserIcon } from '../icons.types';

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

  return `${icon.type}:${icon.icon}:${icon.color}`;
}
