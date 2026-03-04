import { ViewDataSource } from './ViewDataSource.types';

export interface View<TViewOptions extends object = object> {
  /**
   * A unique identifier for the view.
   */
  id: string;

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
   * A [database id]: [design id] map. Used to specify which design to use when rendering
   * entries from that database.
   *
   * If not provided, the database's default design will be used.
   */
  databaseDesignMap?: Record<string, string>;

  /**
   * A [entry id]: [design id] map. Used to override the design used to render a specific entry.
   */
  entryDesignMap?: Record<string, string>;
}
