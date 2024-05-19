import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { UserIconContentIcon, UserIconType } from '@minddrop/icons';
import { setup, cleanup, page1, page1FileContent } from '../test-utils';
import { getPageFromPath } from './getPageFromPath';
import { Page } from '../types';
import { DefaultPageIcon } from '../constants';

const PAGE_TITLE = 'Page';
const PAGE_FILE_PATH = `path/to/${PAGE_TITLE}.md`;
const WRAPPED_PAGE_FILE_PATH = `path/to/${PAGE_TITLE}/${PAGE_TITLE}.md`;

const MockFs = initializeMockFileSystem([
  // Page file
  PAGE_FILE_PATH,
  // Wrapped page file
  WRAPPED_PAGE_FILE_PATH,
  // Page file with content
  {
    path: page1.path,
    textContent: page1FileContent,
  },
]);

describe('getPageFromPath', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('returns default page data if page has no metadata', async () => {
    // Get a page with no metadata
    const page = await getPageFromPath(PAGE_FILE_PATH);

    // Should return a page with default data
    expect(page).toEqual<Page>({
      title: PAGE_TITLE,
      path: PAGE_FILE_PATH,
      wrapped: false,
      icon: DefaultPageIcon,
      contentRaw: '',
      contentParsed: null,
    });
  });

  it('returns ', async () => {
    // Get a page with content
    const page = await getPageFromPath(page1.path);

    // Should set contentRaw to the page markdown content
    expect(page.contentRaw).toBe(page1.contentRaw);
  });

  it('marks page as wrapped if it is wrapped', async () => {
    // Get a wrapped page
    const page = await getPageFromPath(WRAPPED_PAGE_FILE_PATH);

    // Page should be marked as wrapped
    expect(page.wrapped).toBe(true);
  });

  describe('with icon', () => {
    it('gets page content-icon from page metadata', async () => {
      // Add a page with metadata
      MockFs.setFiles([
        {
          path: PAGE_FILE_PATH,
          textContent: '---\nicon: content-icon:cat:cyan\n---',
        },
      ]);

      // Get a page with a content-icon
      const page = await getPageFromPath(PAGE_FILE_PATH);

      // Page should have the icon specified in the metadata
      expect(page.icon).toEqual<UserIconContentIcon>({
        type: UserIconType.ContentIcon,
        icon: 'cat',
        color: 'cyan',
      });
    });
  });
});
