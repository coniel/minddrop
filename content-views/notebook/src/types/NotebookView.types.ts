import { ContentView } from '@minddrop/content-views';

export interface NotebookView extends ContentView {
  type: 'notebook';
  options: Partial<NotebookViewOptions>;
}

export interface NotebookViewOptions {
  /**
   * The width of the list panel in pixels.
   */
  listColumnWidth: number;

  /**
   * The ID of the list design each database's entries render
   * with in the list panel, keyed by database ID. Databases
   * without an override use their default list design.
   */
  listDesignOverrides?: Record<string, string>;

  /**
   * The ID of the page design each database's entries render
   * with in the page panel, keyed by database ID. Databases
   * without an override use their default page design.
   */
  pageDesignOverrides?: Record<string, string>;
}
