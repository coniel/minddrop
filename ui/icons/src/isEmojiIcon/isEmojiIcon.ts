import { UserIcon, UserIconEmoji, UserIconType } from '../icons.types';

/**
 * Returns true if the icon is an emoji icon.
 *
 * @param icon - The icon to check.
 * @returns True if the icon is an emoji icon.
 */
export function isEmojiIcon(icon: UserIcon): icon is UserIconEmoji {
  if (icon.type === UserIconType.Emoji) {
    return true;
  }

  return false;
}
