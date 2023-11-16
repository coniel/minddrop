import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem, Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { setup, cleanup } from '../../test-utils';
import { createSubpage } from './createSubpage';
import { Pages } from '@minddrop/pages';

const PARENT_PAGE_PATH = 'path/to/Page.md';
const WRAPPRED_PARENT_PAGE_PATH = 'path/to/Page/Page.md';
const UNTITLED_MD = `${i18n.t('pages.untitled')}.md`;
const SUBPAGE_PATH = Fs.concatPath(
  Fs.parentDirPath(WRAPPRED_PARENT_PAGE_PATH),
  UNTITLED_MD,
);

const MockFs = initializeMockFileSystem([
  // Parent page
  PARENT_PAGE_PATH,
]);

describe('createSubpage', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();

    // Reset mock file system
    MockFs.reset();
  });

  it('wraps parent page if it is not already wrapped', async () => {
    // Create a page as a child of another page that is not wrapped
    await createSubpage(PARENT_PAGE_PATH);

    // Parent page should be wrapped
    expect(MockFs.exists(WRAPPRED_PARENT_PAGE_PATH)).toBeTruthy();
    expect(MockFs.exists(PARENT_PAGE_PATH)).toBeFalsy();
  });

  it('creates new untitled page', async () => {
    // Create a subpage
    await createSubpage(PARENT_PAGE_PATH);

    // Should create new untitled page
    expect(MockFs.exists(SUBPAGE_PATH)).toBeTruthy();
  });

  it('returns the new page', async () => {
    // Create a subpage
    const page = await createSubpage(PARENT_PAGE_PATH);

    // Should create new untitled page
    expect(page).toEqual(Pages.get(SUBPAGE_PATH));
  });
});
