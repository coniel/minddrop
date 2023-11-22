import { Fs } from '@minddrop/file-system';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PagesStore } from '../PagesStore';
import { getPage } from '../getPage';
import {
  childPage,
  cleanup,
  page1,
  pages,
  parentDir,
  setup,
  wrappedPage,
} from '../test-utils';
import { updateChildPagePaths } from './updateChildPagePaths';

const OLD_PARENT_PATH = parentDir;
const NEW_PARENT_PATH = 'new-parent';
const CHILD_PAGE = Fs.fileNameFromPath(page1.path);
const WRAPPED_CHILD_PAGE = Fs.pathSlice(wrappedPage.path, -2);
const GRANDCHILD_PAGE = Fs.concatPath(
  Fs.parentDirPath(WRAPPED_CHILD_PAGE),
  Fs.fileNameFromPath(childPage.path),
);

describe('updateChildPagePaths', () => {
  beforeEach(() => {
    setup();

    // Add test pages to the store
    PagesStore.getState().load(pages);
  });

  afterEach(cleanup);

  it("recursively updates the child pages' paths", () => {
    // Update the child page paths
    updateChildPagePaths(OLD_PARENT_PATH, NEW_PARENT_PATH);

    // Child page path should be updated
    expect(getPage(Fs.concatPath(NEW_PARENT_PATH, CHILD_PAGE))).not.toBeNull();
    // Wrapped child page path should be updated
    expect(
      getPage(Fs.concatPath(NEW_PARENT_PATH, WRAPPED_CHILD_PAGE)),
    ).not.toBeNull();
    // Grandchild page path should be updated
    expect(
      getPage(Fs.concatPath(NEW_PARENT_PATH, GRANDCHILD_PAGE)),
    ).not.toBeNull();
  });
});
