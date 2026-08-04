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
   * The ID of the page layout used to render the page.
   */
  layout: string;

  /**
   * Values for the design properties bound in the layout, keyed by
   * property name. Contains only properties that appear in the layout.
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
  Pick<Page, 'name' | 'layout' | 'properties'>
>;
