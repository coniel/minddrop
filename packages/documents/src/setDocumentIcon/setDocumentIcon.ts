import { Icons, UserIcon } from '@minddrop/icons';
import { Document } from '../types';
import { setDocumentProperties } from '../setDocumentProperties/setDocumentProperties';

/**
 * Sets the document icon and persists the change to the
 * document file.
 *
 * @param path - The document path.
 * @param icon - The new icon.
 * @returns The updated document.
 */
export async function setDocumentIcon(
  path: string,
  icon: UserIcon,
): Promise<Document> {
  return setDocumentProperties(path, { icon: Icons.stringify(icon) });
}
