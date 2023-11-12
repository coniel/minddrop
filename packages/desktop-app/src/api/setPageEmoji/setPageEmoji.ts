import { EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { Pages } from '@minddrop/pages';

/**
 * Sets the provided emoji as a page's icon.
 *
 * @param path - The page path.
 * @param emoji - The emoji to set as the page icon.
 * @param color - The icon color.
 */
export function setPageEmoji(
  path: string,
  emoji: string,
  skinTone: EmojiSkinTone,
): void {
  Pages.setIcon(path, {
    type: UserIconType.Emoji,
    icon: emoji,
    skinTone,
  });
}
