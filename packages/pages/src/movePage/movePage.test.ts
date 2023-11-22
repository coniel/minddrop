import {
  FileNotFoundError,
  Fs,
  InvalidPathError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PageNotFoundError } from '../errors';
import {
  childPage,
  cleanup,
  grandChildPage,
  page1,
  pages,
  setup,
  wrappedPage,
} from '../test-utils';
import { movePage } from './movePage';
import { PagesStore } from '../PagesStore';
import { getPage } from '../getPage';
import { Events } from '@minddrop/events';
import { PathConflictError } from '@minddrop/core';

const TARGET_DIR = 'path/to/target';
const PAGE_PATH = page1.path;
const WRAPPED_PAGE_PATH = wrappedPage.path;
const MOVED_PAGE_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.fileNameFromPath(PAGE_PATH),
);
const MOVED_WRAPPED_PAGE_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.pathSlice(WRAPPED_PAGE_PATH, -2),
);
const MOVED_CHILD_PAGE_PATH = Fs.concatPath(
  Fs.parentDirPath(MOVED_WRAPPED_PAGE_PATH),
  Fs.pathSlice(childPage.path, -1),
);
const MOVED_GRAND_CHILD_PAGE_PATH = Fs.concatPath(
  TARGET_DIR,
  Fs.pathSlice(grandChildPage.path, -3),
);

const MockFs = initializeMockFileSystem([
  // Page files
  PAGE_PATH,
  WRAPPED_PAGE_PATH,
  // Target directory
  TARGET_DIR,
]);

describe('movePage', () => {
  beforeEach(() => {
    setup();

    // Add test pages to the store
    PagesStore.getState().load(pages);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the page does not exist', () => {
    // Attempt to move a page that does not exist.
    // Should throw a PageNotFoundError.
    expect(() => movePage('does-not-exist', TARGET_DIR)).rejects.toThrow(
      PageNotFoundError,
    );
  });

  it('throws if the page file does not exist', () => {
    // Remove the page file
    MockFs.removeFile(page1.path);

    // Attempt to move a page that does not have a file.
    // Should throw a FileNotFoundError.
    expect(() => movePage(page1.path, TARGET_DIR)).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if the target parent directory does not exist', () => {
    // Attempt to move a page to a directory that does not exist.
    // Should throw a InvalidPathError.
    expect(() => movePage(page1.path, 'missing')).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('throws if the target parent directory is not a directory', () => {
    // Attempt to move a page to a file.
    // Should throw a InvalidPathError.
    expect(() => movePage(page1.path, childPage.path)).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('throws if a child page with the same name exists in the target parent directory', () => {
    // Attempt to move a page to a directory that already has a child page with the same name.
    // Should throw a PathConflictError.
    expect(() =>
      movePage(page1.path, Fs.parentDirPath(page1.path)),
    ).rejects.toThrow(PathConflictError);
  });

  it('moves the page file', async () => {
    // Move the page
    await movePage(page1.path, TARGET_DIR);

    // Old path should not exist
    expect(MockFs.exists(page1.path)).toBe(false);
    // New path should exist
    expect(
      MockFs.exists(Fs.concatPath(TARGET_DIR, Fs.fileNameFromPath(PAGE_PATH))),
    ).toBe(true);
  });

  it('updates the page path in the store', async () => {
    // Move the page
    await movePage(page1.path, TARGET_DIR);

    // The page should have been updated
    expect(getPage(MOVED_PAGE_PATH)).not.toBeNull();
    // Old page should not exist
    expect(getPage(page1.path)).toBeNull();
  });

  it("dispatches a 'pages:page:moved' event", async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:moved' events
      Events.addListener('pages:page:moved', 'test', (payload) => {
        // Payload data should be the old and new page paths
        expect(payload.data).toEqual({
          from: page1.path,
          to: MOVED_PAGE_PATH,
        });
        done();
      });

      // Move the page
      movePage(page1.path, TARGET_DIR);
    }));

  it('returns the new page path', async () => {
    // Move the page
    const newPath = await movePage(page1.path, TARGET_DIR);

    // Should return the new page path
    expect(newPath).toBe(MOVED_PAGE_PATH);
  });

  describe('when the page is wrapped', () => {
    it('updates the page path in the store', async () => {
      // Move the page
      await movePage(wrappedPage.path, TARGET_DIR);

      // The page should have been updated
      expect(getPage(MOVED_WRAPPED_PAGE_PATH)).not.toBeNull();
      // Old page should not exist
      expect(getPage(WRAPPED_PAGE_PATH)).toBeNull();
    });

    it('recursively updates the children paths', async () => {
      // Move the page
      await movePage(wrappedPage.path, TARGET_DIR);

      // Child pages paths should be recursively updated
      expect(getPage(MOVED_CHILD_PAGE_PATH)).not.toBeNull();
      expect(getPage(MOVED_GRAND_CHILD_PAGE_PATH)).not.toBeNull();
    });

    it('retuerns the new page path', async () => {
      // Move the page
      const newPath = await movePage(wrappedPage.path, TARGET_DIR);

      // Should return the new page path
      expect(newPath).toBe(MOVED_WRAPPED_PAGE_PATH);
    });
  });
});
