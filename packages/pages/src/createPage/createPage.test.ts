import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { createPage } from './createPage';
import { Page } from '../types';
import { DefaultPageIcon } from '../constants';
import { getPage } from '../getPage';

const PAGE_TITLE = 'Page';
const PARENT_DIR_PATH = 'path/to/Workspace';
const PAGE_FILE_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}.md`;
const WRAPPED_PAGE_FILE_PATH = `${PARENT_DIR_PATH}/${PAGE_TITLE}/${PAGE_TITLE}.md`;

const PAGE: Page = {
  title: PAGE_TITLE,
  path: PAGE_FILE_PATH,
  icon: DefaultPageIcon,
  wrapped: false,
  contentRaw: '',
  contentParsed: null,
};

const MockFs = initializeMockFileSystem([
  // New page's parent dir
  PARENT_DIR_PATH,
]);

describe('createPage', () => {
  beforeEach(() => {
    setup();

    MockFs.reset();
  });

  afterEach(cleanup);

  it('creates the page file', async () => {
    // Create a page
    await createPage(PARENT_DIR_PATH, PAGE_TITLE);

    // Should create page markdown file
    expect(MockFs.exists(PAGE_FILE_PATH)).toBeTruthy();
  });

  it('creates a wrapped page file if requested', async () => {
    // Create a page
    await createPage(PARENT_DIR_PATH, PAGE_TITLE, { wrap: true });

    // Should create page markdown file
    expect(MockFs.exists(WRAPPED_PAGE_FILE_PATH)).toBeTruthy();
  });

  it('adds the page to the store', async () => {
    // Create a page
    await createPage(PARENT_DIR_PATH, PAGE_TITLE);

    // Page should be in the store
    expect(getPage(PAGE_FILE_PATH)).toEqual(PAGE);
  });

  it('dispatches a `pages:page:create` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:page:create' events
      Events.addListener('pages:page:create', 'test', (payload) => {
        // Payload data should be the page
        expect(payload.data).toEqual(PAGE);
        done();
      });

      // Create a page
      createPage(PARENT_DIR_PATH, PAGE_TITLE);
    }));

  it('returns the new page', async () => {
    // Create a page
    const page = await createPage(PARENT_DIR_PATH, PAGE_TITLE);

    // Should return the new page
    expect(page).toEqual(PAGE);
  });

  describe('wrapped', () => {
    it('wraps the page', async () => {
      // Create a wrapped page
      const page = await createPage(PARENT_DIR_PATH, PAGE_TITLE, {
        wrap: true,
      });

      // Page should be wrapped
      expect(page.wrapped).toBe(true);
    });
  });
});
