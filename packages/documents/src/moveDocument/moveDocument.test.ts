import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentNotFoundError } from '../errors';
import {
  childDocument,
  cleanup,
  grandChildDocument,
  document1,
  documents,
  setup,
  wrappedDocument,
  documentFiles,
} from '../test-utils';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { moveDocument } from './moveDocument';

const TARGET_DIR = 'path/to/target';
const MOVED_DOCUMENT_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.fileNameFromPath(document1.path),
);
const MOVED_WRAPPED_DOCUMENT_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.pathSlice(wrappedDocument.path, -2),
);
const MOVED_CHILD_DOCUMENT_PATH = Fs.concatPath(
  Fs.parentDirPath(MOVED_WRAPPED_DOCUMENT_PATH),
  Fs.pathSlice(childDocument.path, -1),
);
const MOVED_GRAND_CHILD_DOCUMENT_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.pathSlice(grandChildDocument.path, -3),
);

const MockFs = initializeMockFileSystem([
  // Document files
  ...documentFiles,
  // Target directory
  TARGET_DIR,
]);

describe('moveDocument', () => {
  beforeEach(() => {
    setup();

    // Add test documents to the store
    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    // Attempt to move a document that does not exist.
    // Should throw a DocumentNotFoundError.
    expect(() => moveDocument('does-not-exist', TARGET_DIR)).rejects.toThrow(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Remove the document file
    MockFs.removeFile(document1.path);

    // Attempt to move a document that does not have a file.
    // Should throw a FileNotFoundError.
    expect(() => moveDocument(document1.id, TARGET_DIR)).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if the target parent directory does not exist', () => {
    // Attempt to move a document to a directory that does not exist.
    // Should throw a InvalidPathError.
    expect(() => moveDocument(document1.id, 'missing')).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('throws if the target parent directory is not a directory', () => {
    // Attempt to move a document to a file.
    // Should throw a InvalidPathError.
    expect(() =>
      moveDocument(document1.id, childDocument.path),
    ).rejects.toThrow(InvalidPathError);
  });

  it('throws if a child document with the same name exists in the target parent directory', () => {
    // Attempt to move a document to a directory that already has a child document with the same name.
    // Should throw a PathConflictError.
    expect(() =>
      moveDocument(document1.id, Fs.parentDirPath(document1.path)),
    ).rejects.toThrow(PathConflictError);
  });

  it('moves the document file', async () => {
    // Move the document
    await moveDocument(document1.id, TARGET_DIR);

    // Old path should not exist
    expect(MockFs.exists(document1.path)).toBe(false);
    // New path should exist
    expect(
      MockFs.exists(
        Fs.concatPath(TARGET_DIR, Fs.fileNameFromPath(document1.path)),
      ),
    ).toBe(true);
  });

  it('updates the document path in the store', async () => {
    // Move the document
    await moveDocument(document1.id, TARGET_DIR);

    // The document should have been updated
    expect(getDocument(document1.id)?.path).toBe(MOVED_DOCUMENT_PATH);
  });

  it("dispatches a 'documents:document:moved' event", async () =>
    new Promise<void>((done) => {
      // Listen to 'documents:document:moved' events
      Events.addListener('documents:document:moved', 'test', (payload) => {
        // Payload data should be the old and new document paths
        expect(payload.data).toEqual({
          from: document1.path,
          to: MOVED_DOCUMENT_PATH,
        });
        done();
      });

      // Move the document
      moveDocument(document1.id, TARGET_DIR);
    }));

  it('returns the new document path', async () => {
    // Move the document
    const newPath = await moveDocument(document1.id, TARGET_DIR);

    // Should return the new document path
    expect(newPath).toBe(MOVED_DOCUMENT_PATH);
  });

  describe('when the document is wrapped', () => {
    it('updates the document path in the store', async () => {
      // Move the document
      await moveDocument(wrappedDocument.id, TARGET_DIR);

      // The document should have been updated
      expect(getDocument(wrappedDocument.id)?.path).toBe(
        MOVED_WRAPPED_DOCUMENT_PATH,
      );
    });

    it('recursively updates the children paths', async () => {
      // Move the document
      await moveDocument(wrappedDocument.id, TARGET_DIR);

      // Child documents paths should be recursively updated
      expect(getDocument(childDocument.id)?.path).toBe(
        MOVED_CHILD_DOCUMENT_PATH,
      );
      expect(getDocument(grandChildDocument.id)?.path).toBe(
        MOVED_GRAND_CHILD_DOCUMENT_PATH,
      );
    });

    it('returns the new document path', async () => {
      // Move the document
      const newPath = await moveDocument(wrappedDocument.id, TARGET_DIR);

      // Should return the new document path
      expect(newPath).toBe(MOVED_WRAPPED_DOCUMENT_PATH);
    });
  });
});
