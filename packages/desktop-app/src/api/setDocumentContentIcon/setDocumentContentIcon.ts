import { ContentColor } from '@minddrop/core';
import { ContentIconName, UserIconType } from '@minddrop/icons';
import { Documents } from '@minddrop/documents';

/**
 * Sets the provided content-icon as a document's icon.
 *
 * @param path - The document path.
 * @param icon - The name of the content-icon to set.
 * @param color - The icon color.
 */
export function setDocumentContentIcon(
  path: string,
  icon: ContentIconName,
  color: ContentColor,
): void {
  Documents.setIcon(path, {
    type: UserIconType.ContentIcon,
    icon,
    color,
  });
}
