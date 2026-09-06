import { ContentColor } from '@minddrop/ui-theme';
import { parseIcon } from '../parseIcon';
import { UserIcon } from '../types';

/**
 * Returns the color of a content icon or content icon string.
 * Returns undefined if the string is not a valid icon.
 *
 * @param icon - The icon to get the color of.
 * @returns The color of the content icon or undefined.
 */
export function resolveContentIconColor(
  icon: string | UserIcon,
): ContentColor | undefined {
  // Parse stringified icons
  const parsedIcon = typeof icon === 'string' ? parseIcon(icon) : icon;

  if (!parsedIcon) {
    return undefined;
  }

  return parsedIcon.color || undefined;
}
