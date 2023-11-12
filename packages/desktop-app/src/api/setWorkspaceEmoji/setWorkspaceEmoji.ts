import { EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Sets the provided emoji as a workspace's icon.
 *
 * @param path - The workspace path.
 * @param emoji - The emoji to set as the workspace icon.
 * @param color - The icon color.
 */
export function setWorkspaceEmoji(
  path: string,
  emoji: string,
  skinTone: EmojiSkinTone,
): void {
  Workspaces.setIcon(path, {
    type: UserIconType.Emoji,
    icon: emoji,
    skinTone,
  });
}
