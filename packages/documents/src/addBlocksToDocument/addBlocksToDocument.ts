import { Block } from '@minddrop/blocks';
import { getDocument } from '../getDocument';
import { DocumentNotFoundError } from '../errors';
import { updateDocument } from '../updateDocument';
import { getDocumentViews } from '../getDocumentViews';
import { getDocumentViewTypeConfig } from '../DocumentViewTypeConfigsStore';
import { updateDocumentView } from '../updateDocumentView';

/**
 * Adds blocks to a document and its views.
 *
 * If called from a view, the view ID can be passed to prevent the blocks
 * from being added to that view so that the view can handle adding the
 * blocks itself.
 *
 * @param documentId - The ID of the document to add the blocks to.
 * @param blocks - The blocks to add to the document.
 * @param viewId - The ID of the view which called this function, if applicable.
 */
export function addBlocksToDocument(
  documentId: string,
  blocks: Block[],
  viewId?: string,
): void {
  const document = getDocument(documentId);

  // Ensure the document exists
  if (!document) {
    throw new DocumentNotFoundError(documentId);
  }
  //
  // Add the blocks to the document
  updateDocument(documentId, {
    blocks: document.blocks.concat(blocks.map((b) => b.id)),
  });

  // Get the IDs of views which are not the view that
  // received the data transfer.
  const secondaryViews = document.views.filter((v) => v !== viewId);

  // Get the other views and update each view by calling
  // the view config's `onAddBlocks` callback, if applicable.
  getDocumentViews(secondaryViews).forEach((view) => {
    const config = getDocumentViewTypeConfig(view.type);

    if (config.onAddBlocks) {
      updateDocumentView(view.id, config.onAddBlocks(view, blocks));
    }
  });
}
