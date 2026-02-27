import { ContentColor } from '@minddrop/theme';
import { EmojiSkinTone } from '../emoji';
import { ContentIconName, UserIcon, UserIconType } from '../icons.types';

/**
 * Parses a UserIcon from its string representation.
 *
 * @param iconString - The string representation of the icon.
 * @returns A UserIcon or null if the an icon could not be matched.
 */
export function parseIcon(iconString?: string): UserIcon | null {
  if (!iconString) {
    return null;
  }

  // Stringified icon config is in the format 'icon-set:icon:color'
  const [type, icon, color] = iconString.split(':');

  if (type === UserIconType.ContentIcon) {
    return {
      type,
      icon: icon as ContentIconName,
      color: color as ContentColor,
    };
  }

  if (type === UserIconType.Emoji) {
    return { type, icon, skinTone: parseInt(color) as EmojiSkinTone };
  }

  return null;
}
