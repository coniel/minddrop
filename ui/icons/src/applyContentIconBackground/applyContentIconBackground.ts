import { parseIcon } from '../parseIcon';
import { stringifyIcon } from '../stringifyIcon';
import { ContentIconBackground, UserIcon } from '../types';

/**
 * Applies the specified background to the content icon.
 * Invalid icon strings are returned unchanged.
 *
 * @param icon - The icon to apply the background to.
 * @param background - The background to apply to the icon.
 * @returns The icon with the specified background applied.
 */
export function applyContentIconBackground(
  icon: UserIcon,
  background: ContentIconBackground,
): UserIcon;
export function applyContentIconBackground(
  icon: string,
  background: ContentIconBackground,
): string;
export function applyContentIconBackground(
  icon: UserIcon | string,
  background: ContentIconBackground,
): UserIcon | string {
  const actualIcon = typeof icon === 'string' ? parseIcon(icon) : icon;

  if (!actualIcon) {
    return icon;
  }

  // The default background is left out of the icon rather than stored
  const iconWithBackground: UserIcon = { ...actualIcon };
  delete iconWithBackground.background;

  if (background !== ContentIconBackground.None) {
    iconWithBackground.background = background;
  }

  if (typeof icon === 'string') {
    return stringifyIcon(iconWithBackground);
  }

  return iconWithBackground;
}
