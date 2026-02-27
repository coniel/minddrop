import { ContentColor } from '@minddrop/theme';
import { UserIcon, UserIconType } from '../icons.types';
import { parseIcon } from '../parseIcon';
import { stringifyIcon } from '../stringifyIcon';

/**
 * Applies the specified color to the content icon.
 * If the icon is not a content icon, returns it unchanged.
 *
 * @param icon - The icon to apply the color to.
 * @param color - The color to apply to the icon.
 * @returns The icon with the specified color applied.
 */
export function applyContentIconColor(
  icon: UserIcon,
  color: ContentColor,
): UserIcon;
export function applyContentIconColor(
  icon: string,
  color: ContentColor,
): string;
export function applyContentIconColor(
  icon: UserIcon | string,
  color: ContentColor,
): UserIcon | string {
  const actualIcon =
    typeof icon === 'string' ? (parseIcon(icon) as UserIcon) : icon;

  // Ensure the icon is a content icon
  if (actualIcon.type !== UserIconType.ContentIcon) {
    return icon;
  }

  // Apply the color to the content icon
  const iconWithColor = {
    ...actualIcon,
    color,
  };

  if (typeof icon === 'string') {
    return stringifyIcon(iconWithColor);
  }

  return iconWithColor;
}
