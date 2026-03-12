import { ViewDataSource } from './ViewDataSource.types';

export interface View<
  TViewOptions extends object = object,
  TViewData extends object = object,
> {
  /**
   * A unique identifier for the view.
   */
  id: string;

  /**
   * Whether the view is virtual (exists only in memory,
   * not persisted to a file).
   */
  virtual?: boolean;

  /**
   * A user defined name for the view.
   */
  name: string;

  /**
   * The type of view. Must be a registered view type.
   */
  type: string;

  /**
   * The icon for the view. Defaults to the view type's icon.
   */
  icon: string;

  /**
   * The data source for the view.
   */
  dataSource: ViewDataSource;

  /**
   * The last time the view was created.
   */
  created: Date;

  /**
   * The last time the view was modified.
   */
  lastModified: Date;

  /**
   * View type specific options.
   */
  options?: TViewOptions;

  /**
   * View type specific data.
   */
  data?: TViewData;
}

export type CreateVirtualViewData = Pick<View, 'id' | 'type' | 'dataSource'> &
  Partial<Pick<View, 'name' | 'options' | 'data'>>;

export type UpdateViewData = Partial<Pick<View, 'name' | 'options' | 'data'>>;

export type UpdateVirtualViewData = Partial<
  Pick<View, 'id' | 'name' | 'options' | 'data' | 'dataSource'>
>;
