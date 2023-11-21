import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, page1, wrappedPage } from '../test-utils';
import { removeChildPages } from './removeChildPages';
import { Fs } from '@minddrop/file-system';
import { Page } from '../types';
import { PagesStore } from '../PagesStore';
import { getPage } from '../getPage';

const PARENT_PATH = 'path/to/parent';

let child1: Page;
let child2: Page;
let child3: Page;

function setupChildPages(parentPath: string): void {
  child1 = {
    ...page1,
    path: `${parentPath}/child1.md`,
  };
  child2 = {
    ...page1,
    path: `${parentPath}/child2/child2.md`,
  };
  child3 = {
    ...page1,
    path: `${parentPath}/child2/child3.md`,
  };

  // Add the child pages to the store
  PagesStore.getState().load([child1, child2, child3]);
}

describe('removeChildPages', () => {
  beforeEach(() => {
    setup();

    // Initialize the child pages
    setupChildPages(PARENT_PATH);
  });

  afterEach(cleanup);

  it('recursively removes all child pages of the child pages', () => {
    // Remove all child pages of the parent
    removeChildPages(PARENT_PATH);

    // Child pages should no longer exist in the store
    expect(getPage(child1.path)).toBeNull();
    expect(getPage(child2.path)).toBeNull();
    // Nested child pages should no longer exist in the store
    expect(getPage(child3.path)).toBeNull();
  });

  describe('children of wrapped page', () => {
    it('removes all child pages of the wrapped page', () => {
      // Clear the store
      PagesStore.getState().clear();
      // Add a wrapped page to the store
      PagesStore.getState().add(wrappedPage);

      // Initialize the child pages to be children of the
      // wrapped page.
      setupChildPages(Fs.parentDirPath(wrappedPage.path));

      // Remove all child pages of the wrapped page
      removeChildPages(wrappedPage.path);

      // Child pages should no longer exist in the store
      expect(getPage(child1.path)).toBeNull();
      expect(getPage(child2.path)).toBeNull();
      expect(getPage(child3.path)).toBeNull();
    });
  });
});
