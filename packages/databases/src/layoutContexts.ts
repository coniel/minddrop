import { DesignType } from '@minddrop/designs-next';

/**
 * A context in which a database entry (or list of entries) is displayed.
 * Each context maps onto a base design type.
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
 * Maps each layout context to its base design type.
 */
export const layoutContextBaseType: Record<LayoutContext, DesignType> = {
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
