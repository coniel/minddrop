import { ViewDataSource } from './ViewDataSource.types';

export interface VirtualDataViewData {
  /**
   * The unique identifier for the data view.
   */
  id: string;

  /**
   * The type of data view.
   */
  type: string;

  /**
   * The name of the data view.
   */
  name: string;

  /**
   * The icon for the data view.
   */
  icon: string;

  /**
   * The data source for the data view.
   */
  dataSource: ViewDataSource;

  /**
   * DataView type specific options.
   */
  options?: object;

  /**
   * DataView type specific data.
   */
  data?: object;
}
