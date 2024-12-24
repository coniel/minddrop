import { Blocks } from '@minddrop/blocks';
import { BlockDocumentMap } from '../DocumentsStore';
import { addBlocksToDocument } from '../addBlocksToDocument';
import { DocumentNotFoundError, ParentDocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { removeBlocksFromDocument } from '../removeBlocksFromDocument';

/**
 * Moves blocks from one document to another, removing them from the
 * source document and adding them to the target document.
 *
 * @param targetDocumentId - The ID of the document to move the blocks to.
 * @param blockIds - The IDs of the blocks to move.
 *
 * @throws {DocumentNotFoundError} Thrown if the source or target document is not found.
 */
export function moveBlocksToDocument(
  targetDocumentId: string,
  blockIds: string[],
): void {
  const sourceDocumentId = BlockDocumentMap.get(blockIds[0]);

  if (!sourceDocumentId) {
    throw new ParentDocumentNotFoundError(blockIds[0]);
  }

  // Ensure the source document exists
  if (!getDocument(sourceDocumentId)) {
    throw new DocumentNotFoundError(sourceDocumentId);
  }

  // Ensure the target document exists
  if (!getDocument(targetDocumentId)) {
    throw new DocumentNotFoundError(targetDocumentId);
  }

  // Remove the blocks from the source document
  removeBlocksFromDocument(sourceDocumentId, blockIds);

  // Add the blocks to the target document
  addBlocksToDocument(targetDocumentId, Blocks.get(blockIds));
}
