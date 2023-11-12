import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { page1, wrappedPage, pages } from '../test-utils';
import { Page } from '../types';
import { PagesStore } from './PagesStore';

function loadPages() {
  PagesStore.getState().load(pages);
}

describe('PagesStore', () => {
  afterEach(() => {
    PagesStore.getState().clear();
  });

  describe('load', () => {
    it('loads pages into the store, preserving existing ones', () => {
      // Load a page into the store
      PagesStore.getState().load([page1]);
      // Load a second page into the store
      PagesStore.getState().load([wrappedPage]);

      // Both pages should be in the store
      expect(PagesStore.getState().pages).toEqual([page1, wrappedPage]);
    });
  });

  describe('add', () => {
    it('adds a page to the store', () => {
      // Load a page into the store
      PagesStore.getState().load([page1]);

      // Add a second page to the store
      PagesStore.getState().add(wrappedPage);

      // Both pages should be in the store
      expect(PagesStore.getState().pages).toEqual([page1, wrappedPage]);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load pages into the store
      loadPages();
    });

    it('updates the specified page in the store', () => {
      // Update a page
      PagesStore.getState().update(page1.path, { title: 'New title' });

      // Get the page from the store
      const page = PagesStore.getState().pages.find(
        ({ path }) => path === page1.path,
      ) as Page;

      // Page title should be updated
      expect(page).toEqual({ ...page1, title: 'New title' });
    });

    it('does nothing if the worksapce does not exist', () => {
      const initialState = [...PagesStore.getState().pages];

      // Update a missing page
      PagesStore.getState().update('foo', {
        title: 'New title',
      });

      // Pages state should remain unchanged
      expect(PagesStore.getState().pages).toEqual(initialState);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load pages into the store
      loadPages();
    });

    it('removes the page from the store', () => {
      // Remove a page
      PagesStore.getState().remove(page1.path);

      // page should no longer be in the store
      expect(
        PagesStore.getState().pages.find((page) => page.path === page1.path),
      ).toBeUndefined();
    });
  });
});
