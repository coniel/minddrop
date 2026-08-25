import { ContentColor } from '@minddrop/ui-theme';
import { BuiltInContentIconSetId } from '../constants';
import { EmojiSkinTone } from '../types';
import { ContentIconName, UserIcon, UserIconType } from '../types';

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

  // Stringified icon config is in the format 'type:icon:color', with
  // an optional icon set segment: 'type:set:icon:color'
  const segments = iconString.split(':');
  const [type, icon, color] = segments;

  if (type === UserIconType.ContentIcon) {
    // Four segments carry the icon set explicitly
    if (segments.length === 4) {
      return {
        type,
        set: segments[1],
        icon: segments[2] as ContentIconName,
        color: segments[3] as ContentColor,
      };
    }

    // Unqualified icons belong to the built-in set
    return {
      type,
      set: BuiltInContentIconSetId,
      icon: icon as ContentIconName,
      color: color as ContentColor,
    };
  }

  if (type === UserIconType.Emoji) {
    return { type, icon, skinTone: parseInt(color) as EmojiSkinTone };
  }

  return null;
}
