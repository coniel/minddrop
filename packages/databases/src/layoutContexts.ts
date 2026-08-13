import { LayoutType } from '@minddrop/designs-legacy';

/**
 * A context in which a database entry (or list of entries) is displayed.
 * Each context maps onto a base layout type, letting a database pin a
 * different default layout per context while only authoring card, list,
 * and page layouts.
 */
export type LayoutContext =
  | 'card'
  | 'preview-card'
  | 'list'
  | 'navigation-list'
  | 'page'
  | 'dialog'
  | 'panel'
  | 'new-entry';

/**
 * Maps each layout context to the base layout type its layouts are
 * drawn from.
 */
export const layoutContextBaseType: Record<LayoutContext, LayoutType> = {
  card: 'card',
  'preview-card': 'card',
  list: 'list',
  'navigation-list': 'list',
  page: 'page',
  dialog: 'page',
  panel: 'page',
  'new-entry': 'page',
};

/**
 * All layout contexts in display order.
 */
export const LAYOUT_CONTEXTS: LayoutContext[] = [
  'card',
  'preview-card',
  'list',
  'navigation-list',
  'page',
  'dialog',
  'panel',
  'new-entry',
];
