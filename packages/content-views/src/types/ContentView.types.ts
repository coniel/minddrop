import { EntityId } from '@minddrop/utils';
import { ContentViewFilterOptions } from './ContentViewFilterOptions.types';
import { ContentViewSortOptions } from './ContentViewSortOptions.types';
import { ViewDataSource } from './ViewDataSource.types';

export type ContentViewId = EntityId<'content-view'>;

export interface ContentView<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the content view. Virtual content views
   * use caller-supplied composite IDs instead of typed IDs.
   */
  id: string;

  /**
   * Whether the content view is virtual (exists only in memory,
   * not persisted to a file).
   */
  virtual?: boolean;

  /**
   * The ID of the entity responsible for persisting the view's
   * config. Set on virtual views only.
   */
  owner?: EntityId;

  /**
   * Distinguishes the view among its owner's views when the owner
   * has more than one. Opaque to consumers. Set on virtual views
   * only.
   */
  ownerKey?: string;

  /**
   * A user defined name for the content view.
   */
  name: string;

  /**
   * The type of content view. Must be a registered content view type.
   */
  type: string;

  /**
   * The content view's stringified content icon, defaulting to its type's
   * icon.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   */
  icon: string;

  /**
   * The data source for the content view.
   */
  dataSource: ViewDataSource;

  /**
   * The last time the content view was created.
   */
  created: Date;

  /**
   * The last time the content view was modified.
   */
  lastModified: Date;

  /**
   * ContentView type specific options, alongside the filter options
   * shared by all view types and the sort options shared by all
   * sortable view types.
   */
  options?: TViewOptions & ContentViewFilterOptions & ContentViewSortOptions;

  /**
   * ContentView type specific data.
   */
  data?: TViewData;

  /**
   * Runtime index of the item IDs referenced within the view's
   * options and data. Stripped before the view is written to disk.
   */
  references?: string[];
}

export type ContentViewConfig<
  TViewOptions extends object = object,
  TViewData extends object = object,
> = Pick<ContentView<TViewOptions, TViewData>, 'options' | 'data'>;

export type CreateVirtualContentViewData = Pick<
  ContentView,
  'id' | 'type' | 'dataSource'
> &
  Required<Pick<ContentView, 'owner'>> &
  Partial<Pick<ContentView, 'name' | 'options' | 'data' | 'ownerKey'>>;

export type UpdateContentViewData = Partial<
  Pick<ContentView, 'name' | 'icon' | 'options' | 'data'>
>;

export type UpdateVirtualContentViewData = Partial<
  Pick<ContentView, 'id' | 'name' | 'options' | 'data' | 'dataSource'>
>;
