import { Layout } from '@minddrop/designs';
import { PropertyMap } from '@minddrop/properties';
import { EntityId } from '@minddrop/utils';

export type PageId = EntityId<'page'>;

export interface Page {
  /**
   * A unique identifier for the page.
   */
  id: PageId;

  /**
   * The user defined name of the page.
   */
  name: string;

  /**
   * The page icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `asset`: 'asset:[asset-file-name]'
   */
  icon: string;

  /**
   * The page's layout. Always a page type layout, owned by the
   * page rather than referencing a design.
   */
  layout: Layout;

  /**
   * Values for the design properties bound in the layout, keyed by
   * property name.
   *
   * Most elements hold static values instead of binding to properties;
   * properties exist for elements whose values cannot be static, such
   * as collection based elements (a collection can be deleted, so it
   * is a reference rather than a static value).
   */
  properties: PropertyMap;

  /**
   * The date the page was created.
   */
  created: Date;

  /**
   * The date the page was last modified.
   */
  lastModified: Date;
}

export type UpdatePageData = Partial<
  Pick<Page, 'name' | 'icon' | 'layout' | 'properties'>
>;
