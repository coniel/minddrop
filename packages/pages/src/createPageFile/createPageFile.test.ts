import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  initializeMockFileSystem,
  InvalidPathError,
  PathConflictError,
} from '@minddrop/file-system';
import { setup, cleanup } from '../test-utils';
import { createPageFile } from './createPageFile';

const PAGE_TITLE = 'Page';
const PARENT_DIR_PATH = 'path/to/Workspace';
const PAGE_FILE_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}.md`;
const WRAPPED_PAGE_DIR_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}`;
const WRAPPED_PAGE_FILE_PATH = `${WRAPPED_PAGE_DIR_PATH}/${PAGE_TITLE}.md`;

const {
  printFiles,
  resetMockFileSystem,
  clearMockFileSystem,
  addFiles,
  exists,
} = initializeMockFileSystem([PARENT_DIR_PATH]);

describe('createPage', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    resetMockFileSystem();
  });

  afterEach(cleanup);

  it('throws if the parent dir does not exist', () => {
    // Remove parent dir from file system
    clearMockFileSystem();

    // Attempt to create a new page file in missing parent
    // dir. Should throw a InvalidPathError.
    expect(() =>
      createPageFile(PARENT_DIR_PATH, PAGE_TITLE),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the new page conflicts with an existing one', () => {
    // Add a conflicting page to the file system
    addFiles([PAGE_FILE_PATH]);

    // Attempt to create a new page file where one of the same
    // name already exists. Should throw a PathConflictError.
    expect(() =>
      createPageFile(PARENT_DIR_PATH, PAGE_TITLE),
    ).rejects.toThrowError(PathConflictError);
  });

  it('creates the page file', async () => {
    // Create a page file
    await createPageFile(PARENT_DIR_PATH, PAGE_TITLE);

    // Should create the page file
    expect(exists(PAGE_FILE_PATH)).toBe(true);
  });

  it('returns the new page file path', async () => {
    // Create a page file
    const path = await createPageFile(PARENT_DIR_PATH, PAGE_TITLE);

    // Should return the page file path
    expect(path).toBe(PAGE_FILE_PATH);
  });

  describe('wrapped', () => {
    it('throws if the new page dir conflicts with an existing one', () => {
      // Add the target page wrapper dir to the file system
      addFiles([WRAPPED_PAGE_DIR_PATH]);

      // Attempt to create a new wrapped page file where one of the
      // same name already exists. Should throw a PathConflictError.
      expect(() =>
        createPageFile(PARENT_DIR_PATH, PAGE_TITLE, { wrap: true }),
      ).rejects.toThrowError(PathConflictError);
    });

    it('creates the page wrapper directory', async () => {
      // Create a wrapped page file
      await createPageFile(PARENT_DIR_PATH, PAGE_TITLE, { wrap: true });

      // Should create the wrapper dir
      expect(exists(WRAPPED_PAGE_DIR_PATH)).toBe(true);
    });

    it('creates the wrapped page file', async () => {
      // Create a wrapped page file
      await createPageFile(PARENT_DIR_PATH, PAGE_TITLE, { wrap: true });

      // Should create the wrapped page file
      expect(exists(WRAPPED_PAGE_FILE_PATH)).toBe(true);
    });
  });
});
