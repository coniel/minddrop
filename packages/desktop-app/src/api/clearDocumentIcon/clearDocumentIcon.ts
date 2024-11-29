import { DefaultDocumentIcon, Documents } from '@minddrop/documents';

// TODO: move this to Documents API
/**
 * Clears a documents's icon, resetting it to the default
 * icon.
 *
 * @param id - The document id.
 */
export async function clearDocumentIcon(id: string): Promise<void> {
  Documents.setIcon(id, DefaultDocumentIcon);
}
