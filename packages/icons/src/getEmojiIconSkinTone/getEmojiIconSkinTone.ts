import { EmojiSkinTone } from '../emoji';
import { UserIcon, UserIconType } from '../icons.types';

/**
 * Returns the skin tone of an icon if the icon is an emoji icon
 * or an emoji icon string. Otherwise, returns undefined.
 *
 * @param icon - The icon to get the skin tone of.
 * @returns The skin tone of the emoji icon or undefined.
 */
export function getEmojiIconSkinTone(
  icon: string | UserIcon,
): EmojiSkinTone | undefined {
  // Icon is stringified
  if (typeof icon === 'string') {
    // Icon is not an emoji icon
    if (!icon.startsWith(UserIconType.Emoji)) {
      return undefined;
    }

    // Extract skin tone from icon string
    const skinTone = icon.split(':')[2];

    return skinTone ? (parseInt(skinTone) as EmojiSkinTone) : undefined;
  }

  // Icon is not an emoji icon
  if (icon.type !== UserIconType.Emoji) {
    return undefined;
  }

  // Return the skin tone
  return icon.skinTone;
}
