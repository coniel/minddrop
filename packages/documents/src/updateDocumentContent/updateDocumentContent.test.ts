import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, document1, setup } from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { serializeDocumentMetadata, getDocumentMetadata } from '../utils';
import { DocumentNotFoundError } from '../errors';
import { updateDocumentContent } from './updateDocumentContent';
import { getDocument } from '../getDocument';
import { Events } from '@minddrop/events';

const DOCUMENT_PATH = document1.path;
const SERIALIZED_METADATA = serializeDocumentMetadata(getDocumentMetadata(document1));
const NEW_DOCUMENT_CONTENT = '# Title\n\nNew content';

const MockFs = initializeMockFileSystem([
  // Document file
  {
    path: DOCUMENT_PATH,
    textContent: `${SERIALIZED_METADATA}# Title\n\nOld content`,
  },
]);

describe('updateDocumentContent', () => {
  beforeEach(() => {
    setup();

    // Load a document into the store
    DocumentsStore.getState().add(document1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to write a document that does no exist. Should throw
    // a DocumentNotFoundError.
    expect(() => updateDocumentContent('missing', '')).rejects.toThrowError(
      DocumentNotFoundError,
    );
  });

  it('updates the document content in the store', async () => {
    // Wite the document
    await updateDocumentContent(DOCUMENT_PATH, NEW_DOCUMENT_CONTENT);

    // Should update the document content in the store
    expect(getDocument(DOCUMENT_PATH)?.contentRaw).toBe(NEW_DOCUMENT_CONTENT);
  });

  it('writes the document content to the document file', async () => {
    // Update the document content
    await updateDocumentContent(DOCUMENT_PATH, NEW_DOCUMENT_CONTENT);

    // Should write content to file
    expect(MockFs.readTextFile(DOCUMENT_PATH)).toBe(
      `${SERIALIZED_METADATA}${NEW_DOCUMENT_CONTENT}`,
    );
  });

  it('dispatches a "documents:document:update-content" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:update-content' events
      Events.addListener('documents:document:update-content', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual(DOCUMENT_PATH);
        done();
      });

      // Update the document content
      updateDocumentContent(DOCUMENT_PATH, NEW_DOCUMENT_CONTENT);
    }));
});
