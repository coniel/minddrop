import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { initializeMockFileSystem, Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { Pages } from '@minddrop/pages';
import { setup, cleanup } from '../../test-utils';
import { createPage } from './createPage';

const PARENT_DIR_PATH = 'path/to/Parent';
const UNTITLED = i18n.t('pages.untitled');

const MockFs = initializeMockFileSystem([
  // New page's parent dir
  PARENT_DIR_PATH,
]);

describe('createPage', () => {
  beforeEach(() => {
    setup();

    // Pretend parent dir exists
    vi.spyOn(Fs, 'exists').mockImplementation(
      async (path) => path === PARENT_DIR_PATH,
    );

    // Create test parent pages
    Pages.create(PARENT_DIR_PATH, 'Page');
    Pages.create(PARENT_DIR_PATH, 'Wrapped', { wrap: true });
  });

  afterEach(() => {
    cleanup();

    // Reset mock file system
    MockFs.reset();
  });

  it('creates a new "Untitled" page', async () => {
    // Create a page
    const page = await createPage(PARENT_DIR_PATH);

    // Page should be titled 'Untitled'
    expect(page.title).toEqual(UNTITLED);
  });

  it('increments file name and title if it conflicts', async () => {
    // Pretend file 'Untitled.md' already exists
    MockFs.addFiles([Fs.concatPath(PARENT_DIR_PATH, `${UNTITLED}.md`)]);

    // Create a page
    const page = await createPage(PARENT_DIR_PATH);

    // Page should be titled 'Untitled 1'
    expect(page.title).toEqual(`${UNTITLED} 1`);
    // Page file name should be `Untitled 1.md`
    expect(page.path).toEqual(`${PARENT_DIR_PATH}/${UNTITLED} 1.md`);
  });
});
