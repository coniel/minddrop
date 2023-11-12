import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import {
  InvalidPathError,
  PathConflictError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { createPageFile } from './createPageFile';

const PAGE_TITLE = 'Page';
const PARENT_DIR_PATH = 'path/to/Workspace';
const PAGE_FILE_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}.md`;
const WRAPPED_PAGE_DIR_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}`;
const WRAPPED_PAGE_FILE_PATH = `${WRAPPED_PAGE_DIR_PATH}/${PAGE_TITLE}.md`;

let parentDirExists: boolean;
let pageFileExists: boolean;
let wrappedPageDirExists: boolean;

const exists = async (path: string) => {
  switch (path) {
    case PARENT_DIR_PATH:
      return parentDirExists;
    case PAGE_FILE_PATH:
      return pageFileExists;
    case WRAPPED_PAGE_DIR_PATH:
      return wrappedPageDirExists;
    case WRAPPED_PAGE_FILE_PATH:
      return false;
    default:
      throw new Error(`unexpected path: ${path}`);
  }
};

const writeTextFile = vi.fn();
const createDir = vi.fn();

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists,
  writeTextFile,
  createDir,
});

describe('createPage', () => {
  beforeEach(() => {
    setup();

    // Reset Fs return values to favourable values
    parentDirExists = true;
    pageFileExists = false;
    wrappedPageDirExists = false;
  });

  afterEach(cleanup);

  it('throws if the parent dir does not exist', () => {
    // Pretend parent dir does not exist
    parentDirExists = false;

    // Attempt to create a new page file in missing parent
    // dir. Should throw a InvalidPathError.
    expect(() =>
      createPageFile(PARENT_DIR_PATH, PAGE_TITLE),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('throws if the new page conflicts with an existing one', () => {
    // Pretend page already exists
    pageFileExists = true;

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
    expect(writeTextFile).toHaveBeenCalledWith(PAGE_FILE_PATH, '');
  });

  it('returns the new page file path', async () => {
    // Create a page file
    const path = await createPageFile(PARENT_DIR_PATH, PAGE_TITLE);

    // Should return the page file path
    expect(path).toBe(PAGE_FILE_PATH);
  });

  describe('wrapped', () => {
    it('throws if the new page dir conflicts with an existing one', () => {
      // Pretend wrapped page dir already exists
      wrappedPageDirExists = true;

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
      expect(createDir).toHaveBeenCalledWith(WRAPPED_PAGE_DIR_PATH);
    });

    it('creates the wrapped page file', async () => {
      // Create a wrapped page file
      await createPageFile(PARENT_DIR_PATH, PAGE_TITLE, { wrap: true });

      // Should create the wrapped page file
      expect(writeTextFile).toHaveBeenCalledWith(WRAPPED_PAGE_FILE_PATH, '');
    });
  });
});
