import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Fs } from '@minddrop/file-system';
import {
  initializeMockFileSystem,
  FileNotFoundError,
  PathConflictError,
} from '@minddrop/file-system';
import { setup, cleanup, page1 } from '../test-utils';
import { wrapPage } from './wrapPage';
import { getPage } from '../getPage';
import { PagesStore } from '../PagesStore';

const BASE_PATH = Fs.parentDirPath(page1.path);
const PAGE_TITLE = page1.title;
const PAGE_FILENAME = Fs.fileNameFromPath(page1.path);
const PAGE_PATH = Fs.concatPath(BASE_PATH, PAGE_FILENAME);
const WRAPPER_DIR_PATH = Fs.concatPath(BASE_PATH, PAGE_TITLE);
const WRAPPED_PAGE_PATH = Fs.concatPath(BASE_PATH, PAGE_TITLE, PAGE_FILENAME);

const MockFs = initializeMockFileSystem([
  // Page file
  PAGE_PATH,
]);

describe('wrapPage', () => {
  beforeEach(() => {
    setup();

    // Clear pages store
    PagesStore.getState().clear();
    // Reset the mock file system
    MockFs.reset();

    // Add page to store
    PagesStore.getState().load([page1]);
  });

  afterEach(cleanup);

  it('throws if the page file does not exist', () => {
    // Remove page file
    MockFs.clear();

    // Attempt to wrap a page which does not exist, should
    // throw a FileNotFoundError.
    expect(() => wrapPage('foo.md')).rejects.toThrowError(FileNotFoundError);
  });

  it('throws if conflicting dir already exists', () => {
    // Add existing wrapper dir
    MockFs.addFiles([WRAPPER_DIR_PATH]);

    // Attempt to wrap the page, should throw a PathConflictError
    expect(() => wrapPage(PAGE_PATH)).rejects.toThrowError(PathConflictError);
  });

  it('creates the wrapper dir', async () => {
    // Wrap the page
    await wrapPage(PAGE_PATH);

    // Wrapper dir should exist
    expect(MockFs.exists(WRAPPER_DIR_PATH)).toBe(true);
  });

  it('moves the page file into the wrapper dir', async () => {
    // Wrap the page
    await wrapPage(PAGE_PATH);

    // Should move the file into wrapper dir
    expect(MockFs.exists(WRAPPED_PAGE_PATH)).toBe(true);
    // Old file location should no longer exist
    expect(MockFs.exists(PAGE_PATH)).toBe(false);
  });

  it('updates the page in the store', async () => {
    // Wrap the page
    const newPath = await wrapPage(PAGE_PATH);

    // Get the page from the store
    const page = getPage(newPath);

    // Page with new path should exists in the store
    expect(page).not.toBeNull();
    // Page should be marked as wrapped
    expect(page?.wrapped).toBe(true);
    // Page with old path should no longer exists in the store
    expect(getPage(PAGE_PATH)).toBeNull();
  });
});
