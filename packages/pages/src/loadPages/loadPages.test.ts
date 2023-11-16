import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { UserIconContentIcon, UserIconType } from '@minddrop/icons';
import { Events } from '@minddrop/events';
import { setup, cleanup } from '../test-utils';
import { loadPages } from './loadPages';
import { Page } from '../types';
import { PagesStore } from '../PagesStore';

const PAGE_ICON: UserIconContentIcon = {
  type: UserIconType.ContentIcon,
  icon: 'cat',
  color: 'cyan',
};

const SOURCE_DIRS = ['path/to/pages/1', 'path/to/page/2'];
const PAGES: Page[] = SOURCE_DIRS.flatMap<Page>((dirPath) => [
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

initializeMockFileSystem([
  ...PAGES.map((page) => ({
    path: page.path,
    textContent: '---\nicon: "content-icon:cat:cyan"\n---',
  })),
  ...SOURCE_DIRS.map((dir) => `${dir}/image.png`),
]);

describe('loadPages', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads pages into the store', async () => {
    // Load pages
    await loadPages(SOURCE_DIRS);

    // Pages should be in the store
    expect(PagesStore.getState().pages).toEqual(PAGES);
  });

  it('does not load duplicates of pages already in the store', async () => {
    // Load pages twice
    await loadPages(SOURCE_DIRS);
    await loadPages(SOURCE_DIRS);

    // Store should not contain duplicates
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
