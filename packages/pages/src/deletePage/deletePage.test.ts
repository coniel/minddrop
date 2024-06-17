import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, page1 } from '../test-utils';
import { deletePage } from './deletePage';
import {
  initializeMockFileSystem,
  FileNotFoundError,
  Fs,
} from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { Events } from '@minddrop/events';
import { wrapPage } from '../wrapPage';

const PAGE_PATH = page1.path;

const MockFs = initializeMockFileSystem([
  // The page file
  PAGE_PATH,
]);

describe('deletePage', () => {
  beforeEach(() => {
    setup();

    // Add the page to the store
    PagesStore.getState().add(page1);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the page does not exist', () => {
    // Attempt to delete a page that does not exist,
    // should throw a PageNotFoundError.
    expect(() => deletePage('/path/to/nowhere')).rejects.toThrow(
      PageNotFoundError,
    );
  });

  it('throws if the page file does not exist', () => {
    // Remove the page file from the mock file system
    MockFs.removeFile(PAGE_PATH);

    // Attempt to delete the page, should throw a FileNotFoudError
    expect(() => deletePage(PAGE_PATH)).rejects.toThrow(FileNotFoundError);
  });

  it('removes the page from the store', async () => {
    // Delete the page
    await deletePage(PAGE_PATH);

    // Page should no longer exist in the store
    expect(getPage(PAGE_PATH)).toBeNull();
  });

  it('moves the page file to system trash', async () => {
    // Delete the page
    await deletePage(PAGE_PATH);

    // Page file should be in system trash
    expect(MockFs.getTrash()[0].path).toEqual(PAGE_PATH);
  });

  it('dispatches a "pages:page:delete" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:delete' events
      Events.addListener('pages:page:delete', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual(PAGE_PATH);
        done();
      });

      // Delete the page
      deletePage(PAGE_PATH);
    }));

  describe('wrapped page', () => {
    it('deletes the wrapper directory', async () => {
      // Wrap the page
      const wrappedPagePath = await wrapPage(PAGE_PATH);

      // Delete the page
      await deletePage(wrappedPagePath);

      // Wrapper directory should not exist
      expect(MockFs.exists(Fs.parentDirPath(wrappedPagePath))).toBe(false);
    });

    it("removes the wrapped page's children from the store", async () => {
      // Wrap the page
      const wrappedPagePath = await wrapPage(PAGE_PATH);
      // Add a child page
      const childPagePath = `${Fs.parentDirPath(wrappedPagePath)}/child.md`;
      PagesStore.getState().add({
        ...page1,
        path: childPagePath,
      });

      // Delete the page
      await deletePage(wrappedPagePath);

      // Wrapped page's children should not exist in the store
      expect(getPage(childPagePath)).toBeNull();
    });
  });
});
