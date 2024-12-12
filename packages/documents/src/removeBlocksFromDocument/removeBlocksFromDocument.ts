import { getDocumentViewTypeConfig } from '../DocumentViewTypeConfigsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { getDocumentView } from '../getDocumentView';
import { updateDocument } from '../updateDocument';
import { updateDocumentView } from '../updateDocumentView';

/**
 * Removes blocks from a document and its views.
 *
 * @param documentId - The ID of the document to remove the blocks from.
 * @param blockIds  - The IDs of the blocks to remove from the document.
 *
 * @throws {DocumentNotFoundError} - Thrown if no document is found with the provided ID.
 */
export function removeBlocksFromDocument(
  documentId: string,
  blockIds: string[],
): void {
  const document = getDocument(documentId);

  if (!document) {
    throw new DocumentNotFoundError(documentId);
  }

  // Remove the blocks from the document
  updateDocument(documentId, {
    blocks: document.blocks.filter((id) => !blockIds.includes(id)),
  });

  // Remove the blocks from each of the document's views
  document.views.forEach((viewId) => {
    const view = getDocumentView(viewId);
    const config = getDocumentViewTypeConfig(view.type);

    if (!config) {
      return;
    }

    const updatedView = config.onRemoveBlocks(view, blockIds);

    updateDocumentView(viewId, updatedView);
  });
}
