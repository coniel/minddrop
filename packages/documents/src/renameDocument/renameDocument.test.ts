import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';
import { getDocument } from '../getDocument';
import {
  childDocument,
  cleanup,
  document1,
  documentFiles,
  documents,
  setup,
  wrappedDocument,
} from '../test-utils';
import { renameDocument } from './renameDocument';

const NEW_DOCUMENT_NAME = 'new-name';
const NEW_DOCUMENT_PATH = `${Fs.parentDirPath(
  document1.path,
)}/${NEW_DOCUMENT_NAME}.minddrop`;
const WRAPPED_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.pathSlice(wrappedDocument.path, 0, -2),
  NEW_DOCUMENT_NAME,
  `${NEW_DOCUMENT_NAME}.minddrop`,
);
const CHILD_DOCUMENT_NEW_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_DOCUMENT_NEW_PATH),
  Fs.fileNameFromPath(childDocument.path),
);

const MockFs = initializeMockFileSystem(documentFiles);

describe('renameDocument', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load(documents);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the document does not exist', () => {
    // Attempt to rename a document that does not exist. Should throw
    // a DocumentNotFoundError.
    expect(() => renameDocument('does-not-exist', 'new-name')).rejects.toThrow(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Remove the document file
    MockFs.removeFile(document1.path);

    // Attempt to rename the document. Should throw a FileNotFoundError.
    expect(() => renameDocument(document1.id, 'new-name')).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if a document with the same name already exists', () => {
    // Attempt to rename the document to the same name. Should throw
    // a PathConflictError.
    expect(() => renameDocument(document1.id, document1.title)).rejects.toThrow(
      PathConflictError,
    );
  });

  it('renames the document file', async () => {
    // Rename the document
    await renameDocument(document1.id, 'new-name');

    // Old path should not exist
    expect(MockFs.exists(document1.path)).toBe(false);
    // New path should exist
    expect(
      MockFs.exists(`${Fs.parentDirPath(document1.path)}/new-name.minddrop`),
    ).toBe(true);
  });

  it('updates the document in the store', async () => {
    // Rename the document
    await renameDocument(document1.id, 'new-name');

    // Get the updated document
    const document = getDocument(document1.id)!;

    // Title and path should be updated
    expect(document.title).toBe(NEW_DOCUMENT_NAME);
    expect(document.path).toBe(NEW_DOCUMENT_PATH);
  });

  it('dispatches a "documents:document:rename" event', async () =>
    new Promise<void>((done) => {
      Events.addListener('documents:document:rename', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: document1.path,
          newPath: NEW_DOCUMENT_PATH,
        });
        done();
      });

      // Rename a document
      renameDocument(document1.id, NEW_DOCUMENT_NAME);
    }));

  it('returns the updated document', async () => {
    // Rename the document
    const updatedDocument = await renameDocument(
      document1.id,
      NEW_DOCUMENT_NAME,
    );

    // Path, and title should be updated
    expect(updatedDocument.path).toBe(NEW_DOCUMENT_PATH);
    expect(updatedDocument.title).toBe(NEW_DOCUMENT_NAME);
  });

  describe('wrapped document', () => {
    it('renames the wrapping dir', async () => {
      // Rename a wrapped document
      const renamed = await renameDocument(
        wrappedDocument.id,
        NEW_DOCUMENT_NAME,
      );

      // It should rename the wrapping dir as well as the document file
      expect(MockFs.exists(WRAPPED_DOCUMENT_NEW_PATH)).toBe(true);
      // It should update the document's path including the wrapping dir
      expect(renamed.path).toBe(WRAPPED_DOCUMENT_NEW_PATH);
    });

    it('recursively updates child document paths', async () => {
      // Rename a wrapped document
      await renameDocument(wrappedDocument.id, NEW_DOCUMENT_NAME);

      // Child document should have new path in the store
      expect(getDocument(childDocument.id)?.path).toBe(CHILD_DOCUMENT_NEW_PATH);
    });
  });
});
