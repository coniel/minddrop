import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { getPageFromPath } from './getPageFromPath';
import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { Page } from '../types';
import { DefaultPageIcon } from '../constants';
import { UserIconContentIcon, UserIconType } from '@minddrop/icons';

const PAGE_TITLE = 'Page';
const PAGE_FILE_PATH = `path/to/${PAGE_TITLE}.md`;
const WRAPPED_PAGE_FILE_PATH = `path/to/${PAGE_TITLE}/${PAGE_TITLE}.md`;

let readTextFileResult = '';

const readTextFile = async () => readTextFileResult;

registerFileSystemAdapter({
  ...MockFsAdapter,
  readTextFile,
});

describe('getPageFromPath', () => {
  beforeEach(() => {
    setup();

    // Reset readTextFile result
    readTextFileResult = '';
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
    });
  });

  it('marks page as wrapped if it is wrapped', async () => {
    // Get a wrapped page
    const page = await getPageFromPath(WRAPPED_PAGE_FILE_PATH);

    // Page should be marked as wrapped
    expect(page.wrapped).toBe(true);
  });

  describe('with icon', () => {
    it('gets page content-icon from page metadata', async () => {
      // Pretend page metadata defines a content icon
      readTextFileResult = '---\nicon: content-icon:cat:cyan\n---';

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
