import { Icons, UserIcon } from '@minddrop/icons';
import { Document } from '../types';
import { updateDocument } from '../updateDocument';

/**
 * Sets the document icon and persists the change to the
 * document file.
 *
 * @param id - The document ID.
 * @param icon - The new icon.
 * @returns The updated document.
 */
export async function setDocumentIcon(
  id: string,
  icon: UserIcon,
): Promise<Document> {
  return updateDocument(id, { icon: Icons.stringify(icon) });
}
