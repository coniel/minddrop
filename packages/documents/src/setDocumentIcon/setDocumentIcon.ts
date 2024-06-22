import { UserIcon } from '@minddrop/icons';
import { DocumentsStore } from '../DocumentsStore';
import { writeDocumentMetadata } from '../writeDocumentMetadata';

/**
 * Sets the document icon and persists the change to the
 * document file metadata.
 *
 * @param path - The document path.
 * @param icon - The new icon.
 */
export async function setDocumentIcon(path: string, icon: UserIcon): Promise<void> {
  // Update the document in the store
  DocumentsStore.getState().update(path, { icon });

  // Persist the change to the document file metadata
  await writeDocumentMetadata(path);
}
