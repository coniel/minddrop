import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { PAGES_TEST_DATA, Pages, PagesStore } from '@minddrop/pages';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup } from '../../test-utils';
import { movePage } from './movePage';

const { page1 } = PAGES_TEST_DATA;

const WORKSPACE_PATH = 'path/to/workspace';
const PATH_TO_MOVE = 'path/to/Page to move.md';
const PAGE_TO_MOVE = { ...page1, path: PATH_TO_MOVE };
const NEW_SUBPAGE_PATH = Fs.concatPath(
  Fs.parentDirPath(Pages.getWrappedPath(page1.path)),
  Fs.fileNameFromPath(PATH_TO_MOVE),
);
const NEW_WORKSPACE_PAGE_PATH = Fs.concatPath(
  WORKSPACE_PATH,
  Fs.fileNameFromPath(PATH_TO_MOVE),
);

const MockFs = initializeMockFileSystem([
  // Pages
  page1.path,
  PATH_TO_MOVE,
  // Workspace
  WORKSPACE_PATH,
]);

describe('movePage', () => {
  beforeEach(() => {
    setup();

    // Add test pages to the store
    PagesStore.getState().load([page1, PAGE_TO_MOVE]);

    // Reset the mock file system
    MockFs.reset();
  });

  afterEach(() => {
    cleanup();

    // Clear pages store
    PagesStore.getState().clear();
  });

  it('wraps the destination page if it is not wrapped', async () => {
    // Move a page into another page which is not wrapped
    await movePage(PATH_TO_MOVE, page1.path);

    // Should wrap the destination page
    expect(Pages.get(Pages.getWrappedPath(page1.path))).not.toBeNull();
  });

  it('moves the page', async () => {
    // Move a page into another page which is not wrapped
    await movePage(PATH_TO_MOVE, page1.path);
    MockFs.printFiles();

    // Should move the page
    expect(Pages.get(PATH_TO_MOVE)).toBeNull();
    expect(Pages.get(NEW_SUBPAGE_PATH)).not.toBeNull();
  });

  it('supports moving a page into a workspace', async () => {
    // Move a page into a workspace
    await movePage(PATH_TO_MOVE, WORKSPACE_PATH);

    // Should move the page
    expect(Pages.get(PATH_TO_MOVE)).toBeNull();
    expect(Pages.get(NEW_WORKSPACE_PAGE_PATH)).not.toBeNull();
  });
});
