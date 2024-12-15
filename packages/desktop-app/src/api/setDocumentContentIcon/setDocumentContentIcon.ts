import { ContentColor } from '@minddrop/core';
import { Documents } from '@minddrop/documents';
import { ContentIconName, UserIconType } from '@minddrop/icons';

/**
 * Sets the provided content-icon as a document's icon.
 *
 * @param id - The document ID.
 * @param icon - The name of the content-icon to set.
 * @param color - The icon color.
 */
export function setDocumentContentIcon(
  id: string,
  icon: ContentIconName,
  color: ContentColor,
): void {
  Documents.setIcon(id, {
    type: UserIconType.ContentIcon,
    icon,
    color,
  });
}
