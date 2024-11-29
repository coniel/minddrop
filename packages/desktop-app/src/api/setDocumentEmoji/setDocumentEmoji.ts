import { EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { Documents } from '@minddrop/documents';

/**
 * Sets the provided emoji as a document's icon.
 *
 * @param id - The document ID.
 * @param emoji - The emoji to set as the document icon.
 * @param color - The icon color.
 */
export function setDocumentEmoji(
  id: string,
  emoji: string,
  skinTone: EmojiSkinTone,
): void {
  Documents.setIcon(id, {
    type: UserIconType.Emoji,
    icon: emoji,
    skinTone,
  });
}
