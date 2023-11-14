import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { loadPages } from './loadPages';
import { Page } from '../types';
import { UserIconContentIcon, UserIconType } from '@minddrop/icons';
import { PagesStore } from '../PagesStore';
import { Events } from '@minddrop/events';

const PAGE_ICON: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

const SOURCE_DIRS = ['path/to/pages/1', 'path/to/page/2', 'missing-source'];
const PAGES: Page[] = SOURCE_DIRS.slice(0, 2).flatMap<Page>((dirPath) => [
  {
    title: 'Page 1',
    path: `${dirPath}/Page 1.md`,
    icon: PAGE_ICON,
    wrapped: false,
  },
  {
    title: 'Page 2',
    path: `${dirPath}/Page 2/Page 2.md`,
    icon: PAGE_ICON,
    wrapped: true,
  },
  {
    title: 'Page 3',
    path: `${dirPath}/subdir/Page 3.md`,
    icon: PAGE_ICON,
    wrapped: false,
  },
]);

// Pretend that source 'missing-source' does not exist
const exists = async (path: string) => path !== 'missing-source';

// Pretend each source directory contains the following
const readDir = async (path: string) => [
  // Basic page
  {
    path: `${path}/Page 1.md`,
  },
  // Wrapped page
  {
    path: `${path}/Page 2/Page 2.md`,
  },
  // Subdirectory containing a page
  {
    path: `${path}/subdir`,
    children: [
      {
        path: `${path}/subdir/Page 3.md`,
      },
    ],
  },
  // Image, should be ignored
  {
    path: `${path}/image.png`,
  },
];

const readTextFile = async () => '---\nicon: "content-icon:cat:cyan"\n---';

registerFileSystemAdapter({ ...MockFsAdapter, exists, readDir, readTextFile });

describe('loadPages', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads pages into the store', async () => {
    await loadPages(SOURCE_DIRS);
    expect(PagesStore.getState().pages).toEqual(PAGES);
  });

  it('does not load duplicates of pages already in the store', async () => {
    await loadPages(SOURCE_DIRS);
    await loadPages(SOURCE_DIRS);
    expect(PagesStore.getState().pages).toEqual(PAGES);
  });

  it('dispatches a `pages:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'pages:load' events
      Events.addListener('pages:load', 'test', (payload) => {
        // Payload data should be the loaded pages
        expect(payload.data).toEqual(PAGES);
        done();
      });

      // Load pages
      loadPages(SOURCE_DIRS);
    }));
});
