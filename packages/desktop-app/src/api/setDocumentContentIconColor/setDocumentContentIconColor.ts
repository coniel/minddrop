import { ContentColor } from '@minddrop/core';
import { Document, Documents } from '@minddrop/documents';
import { Icons, UserIconType } from '@minddrop/icons';

/**
 * Sets the color of a document's content-icon if it
 * currently has a content-icon as its icon. Otherwise
 * does nothing.
 *
 * @param document - The document for which to set the icon color.
 * @param color - The color to set.
 */
export async function setDocumentContentIconColor(
  document: Document,
  color: ContentColor,
): Promise<void> {
  const icon = Icons.parse(document.icon);

  if (icon?.type !== UserIconType.ContentIcon) {
    return;
  }

  Documents.setIcon(document.id, { ...icon, color });
}
