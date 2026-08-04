import { createObjectStore } from '@minddrop/stores';

export interface PageViewState {
  /**
   * The page ID this state belongs to.
   */
  pageId: string;

  /**
   * Whether the page is in edit mode.
   */
  editing: boolean;
}

/**
 * Persisted object store that tracks per-page view state such
 * as whether the page is in edit mode.
 */
export const PageViewStateStore = createObjectStore<PageViewState>(
  'Pages:ViewState',
  'pageId',
  {
    persistTo: 'app-config',
    namespace: 'page-view-state',
  },
);

const defaultState: Omit<PageViewState, 'pageId'> = {
  editing: false,
};

/**
 * Returns the persisted view state for a page, falling back to
 * defaults for missing fields.
 */
export function usePageViewState(pageId: string): PageViewState {
  const stored = PageViewStateStore.useItem(pageId);

  return {
    ...defaultState,
    pageId,
    ...stored,
  };
}

/**
 * Updates a subset of the view state for a page, creating the
 * entry if it does not exist.
 */
export function setPageViewState(
  pageId: string,
  updates: Partial<Omit<PageViewState, 'pageId'>>,
): void {
  const existing = PageViewStateStore.get(pageId);

  if (existing) {
    PageViewStateStore.update(pageId, updates);
  } else {
    PageViewStateStore.set({
      ...defaultState,
      pageId,
      ...updates,
    });
  }
}
