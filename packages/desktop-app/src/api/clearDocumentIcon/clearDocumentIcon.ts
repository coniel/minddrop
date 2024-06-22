import { UserIconType } from '@minddrop/icons';
import { Documents } from '@minddrop/documents';

/**
 * Clears a documents's icon, resetting it to the default
 * icon.
 *
 * @param path - The document path.
 */
export async function clearDocumentIcon(path: string): Promise<void> {
  Documents.setIcon(path, { type: UserIconType.Default });
}
