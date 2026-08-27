import { EntityId } from '@minddrop/utils';
import { ViewDataSource } from './ViewDataSource.types';

export type DataViewId = EntityId<'data-view'>;

export interface DataView<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the data view. Virtual data views
   * use caller-supplied composite IDs instead of typed IDs.
   */
  id: string;

  /**
   * Whether the data view is virtual (exists only in memory,
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
   * A user defined name for the data view.
   */
  name: string;

  /**
   * The type of data view. Must be a registered data view type.
   */
  type: string;

  /**
   * The data view's stringified content icon, defaulting to its type's
   * icon.
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   */
  icon: string;

  /**
   * The data source for the data view.
   */
  dataSource: ViewDataSource;

  /**
   * The last time the data view was created.
   */
  created: Date;

  /**
   * The last time the data view was modified.
   */
  lastModified: Date;

  /**
   * DataView type specific options.
   */
  options?: TViewOptions;

  /**
   * DataView type specific data.
   */
  data?: TViewData;

  /**
   * Runtime index of the item IDs referenced within the view's
   * options and data. Stripped before the view is written to disk.
   */
  references?: string[];
}

export type DataViewConfig<
  TViewOptions extends object = object,
  TViewData extends object = object,
> = Pick<DataView<TViewOptions, TViewData>, 'options' | 'data'>;

export type CreateVirtualDataViewData = Pick<
  DataView,
  'id' | 'type' | 'dataSource'
> &
  Required<Pick<DataView, 'owner'>> &
  Partial<Pick<DataView, 'name' | 'options' | 'data' | 'ownerKey'>>;

export type UpdateDataViewData = Partial<
  Pick<DataView, 'name' | 'icon' | 'options' | 'data'>
>;

export type UpdateVirtualDataViewData = Partial<
  Pick<DataView, 'id' | 'name' | 'options' | 'data' | 'dataSource'>
>;
