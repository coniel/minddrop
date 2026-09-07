import { parseIcon } from '../parseIcon';
import { ContentIconBackground, UserIcon } from '../types';

/**
 * Returns the background of a content icon or content icon string.
 * Returns undefined if the string is not a valid icon.
 *
 * @param icon - The icon to get the background of.
 * @returns The background of the content icon or undefined.
 */
export function resolveContentIconBackground(
  icon: string | UserIcon,
): ContentIconBackground | undefined {
  // Parse stringified icons
  const parsedIcon = typeof icon === 'string' ? parseIcon(icon) : icon;

  if (!parsedIcon) {
    return undefined;
  }

  return parsedIcon.background ?? ContentIconBackground.None;
}
