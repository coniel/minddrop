import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import {
  childDocument,
  cleanup,
  document1,
  grandChildDocument,
  setup,
  wrappedChildDocument,
  wrappedDocument,
} from '../test-utils';
import { deleteDocument } from './deleteDocument';

const MockFs = initializeMockFileSystem([
  // The document files
  document1.path,
  wrappedDocument.path,
  childDocument.path,
  wrappedChildDocument.path,
  grandChildDocument.path,
]);

describe('deleteDocument', () => {
  beforeEach(() => {
    setup();

    // Load test documents into the store
    DocumentsStore.getState().load([document1, wrappedDocument, childDocument]);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    // Attempt to delete a document that does not exist,
    // should throw a DocumentNotFoundError.
    expect(() => deleteDocument('/path/to/nowhere')).rejects.toThrow(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Remove the document file from the mock file system
    MockFs.removeFile(document1.path);

    // Attempt to delete the document, should throw a FileNotFoudError
    expect(() => deleteDocument(document1.id)).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('removes the document from the store', async () => {
    // Delete the document
    await deleteDocument(document1.id);

    // Document should no longer exist in the store
    expect(getDocument(document1.id)).toBeNull();
  });

  it('moves the document file to system trash', async () => {
    // Delete the document
    await deleteDocument(document1.id);

    // Document file should be in system trash
    expect(MockFs.getTrash()[0].path).toEqual(document1.path);
  });

  it('dispatches a "documents:document:delete" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:delete' events
      Events.addListener('documents:document:delete', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual(document1.id);
        done();
      });

      // Delete the document
      deleteDocument(document1.id);
    }));

  describe('wrapped document', () => {
    it('deletes the wrapper directory', async () => {
      // Delete the document
      await deleteDocument(wrappedDocument.id);

      // Wrapper directory should not exist
      expect(MockFs.exists(Fs.parentDirPath(wrappedDocument.id))).toBe(false);
    });

    it("recursively removes the document's children from the store", async () => {
      // Delete the document
      await deleteDocument(wrappedDocument.id);

      // Wrapped document's children should not exist in the store
      expect(getDocument(childDocument.id)).toBeNull();
      expect(getDocument(grandChildDocument.id)).toBeNull();
    });
  });
});
