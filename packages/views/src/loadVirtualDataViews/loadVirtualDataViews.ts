import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { ViewsLoadedEvent, ViewsLoadedEventData } from '../events';
import { DataView, ViewDataSource } from '../types';

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
}

/**
 * Loads virtual data views into the store without dispatching
 * creation events. Use this when hydrating virtual data views
 * from existing data.
 *
 * @param data - The virtual data view data to load.
 */
export function loadVirtualDataViews(data: VirtualDataViewData[]): void {
  // Generate virtual data view objects from the data
  const views: DataView[] = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
  }));

  // Load data views into the store
  DataViewsStore.load(views);

  // Dispatch a data views loaded event
  Events.dispatch<ViewsLoadedEventData>(ViewsLoadedEvent, views);
}
