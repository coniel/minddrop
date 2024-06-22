import { EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { Documents } from '@minddrop/documents';

/**
 * Sets the provided emoji as a document's icon.
 *
 * @param path - The document path.
 * @param emoji - The emoji to set as the document icon.
 * @param color - The icon color.
 */
export function setDocumentEmoji(
  path: string,
  emoji: string,
  skinTone: EmojiSkinTone,
): void {
  Documents.setIcon(path, {
    type: UserIconType.Emoji,
    icon: emoji,
    skinTone,
  });
}
