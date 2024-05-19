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
import {
  childPage,
  cleanup,
  page1,
  page1FileContent,
  pages,
  setup,
  wrappedPage,
} from '../test-utils';
import { renamePage } from './renamePage';

const PAGE_PATH = page1.path;
const NEW_PAGE_NAME = 'new-name';
const NEW_PAGE_PATH = `${Fs.parentDirPath(PAGE_PATH)}/${NEW_PAGE_NAME}.md`;
const WRAPPED_PAGE_PATH = wrappedPage.path;
const WRAPPED_PAGE_NEW_PATH = Fs.concatPath(
  Fs.pathSlice(WRAPPED_PAGE_PATH, 0, -2),
  NEW_PAGE_NAME,
  `${NEW_PAGE_NAME}.md`,
);
const CHILD_PAGE_NEW_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_PAGE_NEW_PATH),
  Fs.fileNameFromPath(childPage.path),
);

const MockFs = initializeMockFileSystem([
  // The page files
  { path: PAGE_PATH, textContent: page1FileContent },
  WRAPPED_PAGE_PATH,
]);

describe('renamePage', () => {
  beforeEach(() => {
    setup();

    // Add test pages to store
    PagesStore.getState().load(pages);
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

  it('updates the markdown heading', async () => {
    // Rename the page
    await renamePage(PAGE_PATH, 'New name');

    // The markdown content should be updated with the new heading
    const content = MockFs.readTextFile(
      `${Fs.parentDirPath(PAGE_PATH)}/New name.md`,
    );

    expect(content).toContain('# New name');
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
    // The page heading should be updated
    expect(getPage(NEW_PAGE_PATH)?.contentRaw).toContain(`# ${NEW_PAGE_NAME}`);
  });

  it('dispatches a "pages:page:renamed" event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:renamed' events
      Events.addListener('pages:page:renamed', 'test', (payload) => {
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

    // Path, title, and markdown heading should be updated
    expect(updatedPage.path).toBe(NEW_PAGE_PATH);
    expect(updatedPage.title).toBe(NEW_PAGE_NAME);
    expect(updatedPage.contentRaw).toContain(`# ${NEW_PAGE_NAME}`);
  });

  describe('wrapped page', () => {
    it('renames the wrapping dir', async () => {
      // Rename a wrapped page
      const renamed = await renamePage(WRAPPED_PAGE_PATH, NEW_PAGE_NAME);

      // It should rename the wrapping dir as well as the page file
      expect(MockFs.exists(WRAPPED_PAGE_NEW_PATH)).toBe(true);
      // It should update the page's path including the wrapping dir
      expect(renamed.path).toBe(WRAPPED_PAGE_NEW_PATH);
    });

    it('recursively updates child page paths', async () => {
      // Rename a wrapped page
      await renamePage(WRAPPED_PAGE_PATH, NEW_PAGE_NAME);

      // Child page should have new path in the store
      expect(getPage(CHILD_PAGE_NEW_PATH)).not.toBeNull();
    });
  });
});
