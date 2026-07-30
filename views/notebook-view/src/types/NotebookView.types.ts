import { View } from '@minddrop/views';

export interface NotebookView extends View {
  type: 'notebook';
  options: Partial<NotebookViewOptions>;
}

export interface NotebookViewLayoutOverride {
  /**
   * The layout to use for list items. When set to 'default'
   * or omitted, the database default list layout is used.
   */
  listLayoutId?: string;

  /**
   * The layout to use for the page view. When set to 'default'
   * or omitted, the database default page layout is used.
   */
  pageLayoutId?: string;
}

export interface NotebookViewOptions {
  /**
   * The width of the list panel in pixels.
   */
  listColumnWidth: number;

  /**
   * Per-database layout overrides, keyed by database ID.
   * Each entry specifies which list and page layouts to use
   * for entries from that database.
   */
  layoutOverrides?: Record<string, NotebookViewLayoutOverride>;
}
