import { UserIcon, UserIconContentIcon } from '../icons.types';

/**
 * Returns true if the icon is a content icon.
 *
 * @param icon - The icon to check.
 * @returns True if the icon is a content icon.
 */
export function isContentIcon(icon: UserIcon): icon is UserIconContentIcon {
  if (icon.type === 'content-icon') {
    return true;
  }

  return false;
}
