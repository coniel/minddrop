import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  InvalidPathError,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { cleanup, setup } from '../test-utils';
import { createDocumentFile } from './createDocumentFile';

const TITLE = 'Document';
const CONTENT = 'Hello, world!';
const PARENT_DIR_PATH = 'path/to/Workspace';
const DOCUMENT_FILE_PATH = `${PARENT_DIR_PATH}/${TITLE}.minddrop`;
const WRAPPED_DOCUMENT_DIR_PATH = `${PARENT_DIR_PATH}/${TITLE}`;
const WRAPPED_DOCUMENT_FILE_PATH = `${WRAPPED_DOCUMENT_DIR_PATH}/${TITLE}.minddrop`;

const MockFs = initializeMockFileSystem([
  // New documents's parent dir
  PARENT_DIR_PATH,
]);

describe('createDocument', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the parent dir does not exist', () => {
    // Remove parent dir from file system
    MockFs.clear();

    // Attempt to create a new document file in missing parent
    // dir. Should throw a InvalidPathError.
    expect(() =>
      createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the new document conflicts with an existing one', () => {
    // Add a conflicting document to the file system
    MockFs.addFiles([DOCUMENT_FILE_PATH]);

    // Attempt to create a new document file where one of the same
    // name already exists. Should throw a PathConflictError.
    expect(() =>
      createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT),
    ).rejects.toThrowError(PathConflictError);
  });

  it('creates the document file with content', async () => {
    // Create a document file
    await createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT);

    // Should create the document file
    expect(MockFs.exists(DOCUMENT_FILE_PATH)).toBe(true);
    // Should write the document content to the file
    expect(MockFs.readTextFile(DOCUMENT_FILE_PATH)).toBe(CONTENT);
  });

  it('returns the new document file path', async () => {
    // Create a document file
    const path = await createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT);

    // Should return the document file path
    expect(path).toBe(DOCUMENT_FILE_PATH);
  });

  describe('wrapped', () => {
    it('throws if the new document dir conflicts with an existing one', () => {
      // Add the target document wrapper dir to the file system
      MockFs.addFiles([WRAPPED_DOCUMENT_DIR_PATH]);

      // Attempt to create a new wrapped document file where one of the
      // same name already exists. Should throw a PathConflictError.
      expect(() =>
        createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT, {
          wrap: true,
        }),
      ).rejects.toThrowError(PathConflictError);
    });

    it('creates the document wrapper directory', async () => {
      // Create a wrapped document file
      await createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT, {
        wrap: true,
      });

      // Should create the wrapper dir
      expect(MockFs.exists(WRAPPED_DOCUMENT_DIR_PATH)).toBe(true);
    });

    it('creates the wrapped document file', async () => {
      // Create a wrapped document file
      await createDocumentFile(PARENT_DIR_PATH, TITLE, CONTENT, {
        wrap: true,
      });

      // Should create the wrapped document file
      expect(MockFs.exists(WRAPPED_DOCUMENT_FILE_PATH)).toBe(true);
    });
  });
});
