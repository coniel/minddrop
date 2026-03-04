import { RootElement } from '@minddrop/designs';

export interface Page {
  /**
   * A unique identifier for the page.
   */
  id: string;

  /**
   * The user defined name of the page.
   */
  name: string;

  /**
   * The page's design tree.
   */
  tree: RootElement;

  /**
   * The date the page was created.
   */
  created: Date;

  /**
   * The date the page was last modified.
   */
  lastModified: Date;
}

export type UpdatePageData = Partial<Pick<Page, 'name' | 'tree'>>;
