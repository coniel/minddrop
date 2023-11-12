import { create } from 'zustand';
import { Page } from '../types';

export interface PagesStore {
  /**
   * The user's pages.
   */
  pages: Page[];

  /**
   * Load pages into the store.
   */
  load(page: Page[]): void;

  /**
   * Add a page to the store.
   */
  add(page: Page): void;

  /**
   * Updates a page in the store by path.
   */
  update(path: string, data: Partial<Page>): void;

  /**
   * Remove a page from the store by path.
   */
  remove(path: string): void;

  /**
   * Clear all pages.
   */
  clear(): void;
}

export const PagesStore = create<PagesStore>()((set) => ({
  pages: [],

  load: (pages) => set((state) => ({ pages: [...state.pages, ...pages] })),

  add: (page) =>
    set((state) => {
      return {
        pages: [...state.pages, page],
      };
    }),

  update: (path, data) =>
    set((state) => {
      const index = state.pages.findIndex((page) => page.path === path);
      const pages = [...state.pages];

      if (index === -1) {
        return {};
      }

      pages[index] = { ...pages[index], ...data };

      return { pages };
    }),

  remove: (path) =>
    set((state) => {
      return {
        pages: state.pages.filter((page) => path !== page.path),
      };
    }),

  clear: () => set({ pages: [] }),
}));
