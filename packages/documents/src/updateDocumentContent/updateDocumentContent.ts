import { getDocumentMetadata, serializeDocumentMetadata } from '../utils';
import { getDocument } from '../getDocument';
import { DocumentNotFoundError } from '../errors';
import { writeDocument } from '../writeDocument';
import { DocumentsStore } from '../DocumentsStore';
import { Events } from '@minddrop/events';

/**
 * Updates a document's markdown content in the store and writes it
 * to the document file.
 *
 * @param path - The path to the document's markdown file.
 * @param content - The content to write to the document's markdown file.
 *
 * @throws {DocumentNotFoundError} - If the document does not exist.
 * @throws {FileNotFoundError} - If the document's markdown file does not exist.
 * @dispatches 'documents:document:update-content'
 */
export async function updateDocumentContent(
  path: string,
  content: string,
): Promise<void> {
  const document = getDocument(path);

  // Ensure the document exists.
  if (!document) {
    throw new DocumentNotFoundError(path);
  }

  // Generate the document's front matter
  const frontMatter = serializeDocumentMetadata(getDocumentMetadata(document));

  // Update the document's raw content in the store
  DocumentsStore.getState().update(path, { fileTextContent: content });

  // Write the document's content, including front matter,
  // to the markdown file.
  writeDocument(path, `${frontMatter}${content}`);

  // Dispatch a 'documents:document:update-content' event
  Events.dispatch('documents:document:update-content', path);
}
