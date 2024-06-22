import { ContentColor } from '@minddrop/core';
import { Icons, UserIconType } from '@minddrop/icons';
import { Document, Documents } from '@minddrop/documents';

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

  Documents.setIcon(document.path, { ...icon, color });
}
