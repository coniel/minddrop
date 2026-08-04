import { EntityId } from '@minddrop/utils';
import { ViewDataSource } from './ViewDataSource.types';

export type DataViewId = EntityId<'view'>;

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
   * A user defined name for the data view.
   */
  name: string;

  /**
   * The type of data view. Must be a registered data view type.
   */
  type: string;

  /**
   * The icon for the data view. Defaults to the data view type's icon.
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
}

export type CreateVirtualDataViewData = Pick<
  DataView,
  'id' | 'type' | 'dataSource'
> &
  Partial<Pick<DataView, 'name' | 'options' | 'data'>>;

export type UpdateDataViewData = Partial<
  Pick<DataView, 'name' | 'icon' | 'options' | 'data'>
>;

export type UpdateVirtualDataViewData = Partial<
  Pick<DataView, 'id' | 'name' | 'options' | 'data' | 'dataSource'>
>;
