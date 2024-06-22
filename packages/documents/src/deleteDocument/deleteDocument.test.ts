import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, document1 } from '../test-utils';
import { deleteDocument } from './deleteDocument';
import {
  initializeMockFileSystem,
  FileNotFoundError,
  Fs,
} from '@minddrop/file-system';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import { Events } from '@minddrop/events';
import { wrapDocument } from '../wrapDocument';

const DOCUMENT_PATH = document1.path;

const MockFs = initializeMockFileSystem([
  // The document file
  DOCUMENT_PATH,
]);

describe('deleteDocument', () => {
  beforeEach(() => {
    setup();

    // Add the document to the store
    DocumentsStore.getState().add(document1);
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
    MockFs.removeFile(DOCUMENT_PATH);

    // Attempt to delete the document, should throw a FileNotFoudError
    expect(() => deleteDocument(DOCUMENT_PATH)).rejects.toThrow(FileNotFoundError);
  });

  it('removes the document from the store', async () => {
    // Delete the document
    await deleteDocument(DOCUMENT_PATH);

    // Document should no longer exist in the store
    expect(getDocument(DOCUMENT_PATH)).toBeNull();
  });

  it('moves the document file to system trash', async () => {
    // Delete the document
    await deleteDocument(DOCUMENT_PATH);

    // Document file should be in system trash
    expect(MockFs.getTrash()[0].path).toEqual(DOCUMENT_PATH);
  });

  it('dispatches a "documents:document:delete" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:delete' events
      Events.addListener('documents:document:delete', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual(DOCUMENT_PATH);
        done();
      });

      // Delete the document
      deleteDocument(DOCUMENT_PATH);
    }));

  describe('wrapped document', () => {
    it('deletes the wrapper directory', async () => {
      // Wrap the document
      const wrappedDocumentPath = await wrapDocument(DOCUMENT_PATH);

      // Delete the document
      await deleteDocument(wrappedDocumentPath);

      // Wrapper directory should not exist
      expect(MockFs.exists(Fs.parentDirPath(wrappedDocumentPath))).toBe(false);
    });

    it("removes the wrapped document's children from the store", async () => {
      // Wrap the document
      const wrappedDocumentPath = await wrapDocument(DOCUMENT_PATH);
      // Add a child document
      const childDocumentPath = `${Fs.parentDirPath(wrappedDocumentPath)}/child.md`;
      DocumentsStore.getState().add({
        ...document1,
        path: childDocumentPath,
      });

      // Delete the document
      await deleteDocument(wrappedDocumentPath);

      // Wrapped document's children should not exist in the store
      expect(getDocument(childDocumentPath)).toBeNull();
    });
  });
});
