import { EntityId } from '@minddrop/utils';
import { ViewDataSource } from './ViewDataSource.types';

export interface VirtualContentViewData {
  /**
   * The unique identifier for the content view.
   */
  id: string;

  /**
   * The type of content view.
   */
  type: string;

  /**
   * The name of the content view.
   */
  name: string;

  /**
   * The icon for the content view.
   */
  icon: string;

  /**
   * The data source for the content view.
   */
  dataSource: ViewDataSource;

  /**
   * The ID of the entity responsible for persisting the view's
   * config.
   */
  owner?: EntityId;

  /**
   * Distinguishes the view among its owner's views when the owner
   * has more than one.
   */
  ownerKey?: string;

  /**
   * ContentView type specific options.
   */
  options?: object;

  /**
   * ContentView type specific data.
   */
  data?: object;
}
