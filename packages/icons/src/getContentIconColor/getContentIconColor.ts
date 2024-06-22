import { ContentColor } from '@minddrop/core';
import { UserIcon, UserIconType } from '../icons.types';

/**
 * Returns the color of a content icon if the icon is a content icon
 * or a content icon string. Otherwise, returns undefined.
 *
 * @param icon - The icon to get the color of.
 * @returns The color of the content icon or undefined.
 */
export function getContentIconColor(
  icon: string | UserIcon,
): ContentColor | undefined {
  // Icon is stringified
  if (typeof icon === 'string') {
    // Icon is not a content icon
    if (!icon.startsWith(UserIconType.ContentIcon)) {
      return undefined;
    }

    // Extract color from icon string
    return (icon.split(':')[2] as ContentColor) || undefined;
  }

  // Icon is not a content icon
  if (icon.type !== UserIconType.ContentIcon) {
    return undefined;
  }

  // Return the icon color
  return icon.color;
}
