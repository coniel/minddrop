import { ContentColor } from '@minddrop/ui-theme';
import { parseIcon } from '../parseIcon';
import { UserIcon, UserIconType } from '../types';

/**
 * Returns the color of a content icon if the icon is a content icon
 * or a content icon string. Otherwise, returns undefined.
 *
 * @param icon - The icon to get the color of.
 * @returns The color of the content icon or undefined.
 */
export function resolveContentIconColor(
  icon: string | UserIcon,
): ContentColor | undefined {
  // Parse stringified icons
  const parsedIcon = typeof icon === 'string' ? parseIcon(icon) : icon;

  // Icon is not a content icon
  if (!parsedIcon || parsedIcon.type !== UserIconType.ContentIcon) {
    return undefined;
  }

  // Return the icon color
  return parsedIcon.color || undefined;
}
