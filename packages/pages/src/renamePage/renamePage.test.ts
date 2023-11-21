import { Events } from '@minddrop/events';
import {
  FileNotFoundError,
  Fs,
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PagesStore } from '../PagesStore';
import { PageNotFoundError } from '../errors';
import { getPage } from '../getPage';
import { cleanup, page1, setup } from '../test-utils';
import { wrapPage } from '../wrapPage';
import { renamePage } from './renamePage';

const PAGE_PATH = page1.path;
const NEW_PAGE_NAME = 'new-name';
const NEW_PAGE_PATH = `${Fs.parentDirPath(PAGE_PATH)}/${NEW_PAGE_NAME}.md`;

const MockFs = initializeMockFileSystem([
  // The page file
  PAGE_PATH,
]);

describe('renamePage', () => {
  beforeEach(() => {
    setup();

    // Add test page to store
    PagesStore.getState().add(page1);
  });

  afterEach(() => {
    cleanup();

    // Reset the mock file system
    MockFs.reset();
  });

  it('throws if the page does not exist', () => {
    // Attempt to rename a page that does not exist. Should throw
    // a PageNotFoundError.
    expect(() => renamePage('does-not-exist', 'new-name')).rejects.toThrow(
      PageNotFoundError,
    );
  });

  it('throws if the page file does not exist', () => {
    // Remove the page file
    MockFs.removeFile(PAGE_PATH);

    // Attempt to rename the page. Should throw a FileNotFoundError.
    expect(() => renamePage(PAGE_PATH, 'new-name')).rejects.toThrow(
      FileNotFoundError,
    );
  });

  it('throws if a page with the same name already exists', () => {
    // Attempt to rename the page to the same name. Should throw
    // a PathConflictError.
    expect(() => renamePage(PAGE_PATH, page1.title)).rejects.toThrow(
      PathConflictError,
    );
  });

  it('renames the page file', async () => {
    // Rename the page
    await renamePage(PAGE_PATH, 'new-name');

    // Old path should not exist
    expect(MockFs.exists(PAGE_PATH)).toBe(false);
    // New path should exist
    expect(MockFs.exists(`${Fs.parentDirPath(PAGE_PATH)}/new-name.md`)).toBe(
      true,
    );
  });

  it('updates the page in the store', async () => {
    // Rename the page
    await renamePage(PAGE_PATH, 'new-name');

    // Old path should not exist in the store
    expect(getPage(PAGE_PATH)).toBeNull();

    // New path should exist in the store and have
    // the new path and title.
    expect(getPage(NEW_PAGE_PATH)?.path).toBe(NEW_PAGE_PATH);
    expect(getPage(NEW_PAGE_PATH)?.title).toBe(NEW_PAGE_NAME);
  });

  it('dispatches a "pages:page:rename" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:rename' events
      Events.addListener('pages:page:rename', 'test', (payload) => {
        // Payload data should contain old and new paths
        expect(payload.data).toEqual({
          oldPath: PAGE_PATH,
          newPath: NEW_PAGE_PATH,
        });
        done();
      });

      // Rename a page
      renamePage(PAGE_PATH, NEW_PAGE_NAME);
    }));

  it('returns the updated page', async () => {
    // Rename the page
    const updatedPage = await renamePage(PAGE_PATH, NEW_PAGE_NAME);

    // Path and title should be updated
    expect(updatedPage.path).toBe(NEW_PAGE_PATH);
    expect(updatedPage.title).toBe(NEW_PAGE_NAME);
  });

  describe('wrapped page', () => {
    it('renames the wrapping dir', async () => {
      // Wrap the page
      const wrappedPath = await wrapPage(PAGE_PATH);

      // Rename the page
      const renamed = await renamePage(wrappedPath, NEW_PAGE_NAME);

      // The new page path
      const newPath = Fs.concatPath(
        Fs.parentDirPath(PAGE_PATH),
        NEW_PAGE_NAME,
        `${NEW_PAGE_NAME}.md`,
      );

      // It should rename the wrapping dir as well as the page file
      expect(MockFs.exists(newPath)).toBe(true);
      // It should update the page's path including the wrapping dir
      expect(renamed.path).toBe(newPath);
    });
  });
});
