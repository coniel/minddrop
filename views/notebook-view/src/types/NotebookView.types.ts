import { View } from '@minddrop/views';

export interface NotebookView extends View {
  type: 'notebook';
  options: Partial<NotebookViewOptions>;
}

export interface NotebookViewDesignOverride {
  /**
   * The design to use for list items. When set to 'default'
   * or omitted, the database default list design is used.
   */
  listDesignId?: string;

  /**
   * The design to use for the page view. When set to 'default'
   * or omitted, the database default page design is used.
   */
  pageDesignId?: string;
}

export interface NotebookViewOptions {
  /**
   * The width of the list panel in pixels.
   */
  listColumnWidth: number;

  /**
   * Per-database design overrides, keyed by database ID.
   * Each entry specifies which list and page designs to use
   * for entries from that database.
   */
  designOverrides?: Record<string, NotebookViewDesignOverride>;
}
