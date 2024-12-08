import { Blocks } from '@minddrop/blocks';
import { addBlocksToDocument } from '../addBlocksToDocument';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { removeBlocksFromDocument } from '../removeBlocksFromDocument';

/**
 * Moves blocks from one document to another, removing them from the
 * source document and adding them to the target document.
 *
 * @param sourceDocumentId - The ID of the document to move the blocks from.
 * @param targetDocumentId - The ID of the document to move the blocks to.
 * @param blockIds - The IDs of the blocks to move.
 *
 * @throws {DocumentNotFoundError} Thrown if the source or target document is not found.
 */
export function moveBlocksToDocument(
  sourceDocumentId: string,
  targetDocumentId: string,
  blockIds: string[],
): void {
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
