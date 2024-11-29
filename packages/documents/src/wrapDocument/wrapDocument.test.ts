import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import {
  initializeMockFileSystem,
  FileNotFoundError,
  PathConflictError,
} from '@minddrop/file-system';
import { setup, cleanup, document1, documentFiles } from '../test-utils';
import { wrapDocument } from './wrapDocument';
import { getDocument } from '../getDocument';
import { DocumentsStore } from '../DocumentsStore';
import { DocumentNotFoundError } from '../errors';

const BASE_PATH = Fs.parentDirPath(document1.path);
const DOCUMENT_FILENAME = Fs.fileNameFromPath(document1.path);
const DOCUMENT_PATH = Fs.concatPath(BASE_PATH, DOCUMENT_FILENAME);
const WRAPPER_DIR_PATH = Fs.concatPath(BASE_PATH, document1.title);
const WRAPPED_DOCUMENT_PATH = Fs.concatPath(
  BASE_PATH,
  document1.title,
  DOCUMENT_FILENAME,
);

const MockFs = initializeMockFileSystem(documentFiles);

describe('wrapDocument', () => {
  beforeEach(() => {
    setup();

    // Clear documents store
    DocumentsStore.getState().clear();
    // Reset the mock file system
    MockFs.reset();

    // Add document to store
    DocumentsStore.getState().load([document1]);
  });

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to wrap a document which does not exist, should
    // throw a DocumentNotFoundError.
    expect(() => wrapDocument('invalid-id')).rejects.toThrowError(
      DocumentNotFoundError,
    );
  });

  it('throws if the document file does not exist', () => {
    // Remove document file
    MockFs.clear();

    // Attempt to wrap a document which does not exist, should
    // throw a FileNotFoundError.
    expect(() => wrapDocument(document1.id)).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('throws if conflicting dir already exists', () => {
    // Add existing wrapper dir
    MockFs.addFiles([WRAPPER_DIR_PATH]);

    // Attempt to wrap the document, should throw a PathConflictError
    expect(() => wrapDocument(document1.id)).rejects.toThrowError(
      PathConflictError,
    );
  });

  it('creates the wrapper dir', async () => {
    // Wrap the document
    await wrapDocument(document1.id);

    // Wrapper dir should exist
    expect(MockFs.exists(WRAPPER_DIR_PATH)).toBe(true);
  });

  it('moves the document file into the wrapper dir', async () => {
    // Wrap the document
    await wrapDocument(document1.id);

    // Should move the file into wrapper dir
    expect(MockFs.exists(WRAPPED_DOCUMENT_PATH)).toBe(true);
    // Old file location should no longer exist
    expect(MockFs.exists(DOCUMENT_PATH)).toBe(false);
  });

  it('updates the document in the store', async () => {
    // Wrap the document
    const newPath = await wrapDocument(document1.id);

    // Get the document from the store
    const document = getDocument(document1.id);

    // Document with new path should exists in the store
    expect(document?.path).toBe(newPath);
    // Document should be marked as wrapped
    expect(document?.wrapped).toBe(true);
  });

  it('dispatches a document wrapped event', async () =>
    new Promise<void>((done) => {
      // Listen to document wrapped events
      Events.addListener('documents:document:wrap', 'test', (payload) => {
        // Payload data should be the old and new document paths
        expect(payload.data).toEqual({
          oldPath: document1.path,
          newPath: WRAPPED_DOCUMENT_PATH,
        });
        done();
      });

      // Wrap the document
      wrapDocument(document1.id);
    }));
});
