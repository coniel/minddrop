import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewsLoadedEvent, ViewsLoadedEventData } from '../events';
import { View, ViewDataSource } from '../types';

export interface VirtualViewData {
  /**
   * The unique identifier for the view.
   */
  id: string;

  /**
   * The type of view.
   */
  type: string;

  /**
   * The name of the view.
   */
  name: string;

  /**
   * The icon for the view.
   */
  icon: string;

  /**
   * The data source for the view.
   */
  dataSource: ViewDataSource;

  /**
   * View type specific options.
   */
  options?: object;
}

/**
 * Loads virtual views into the store without dispatching
 * creation events. Use this when hydrating virtual views
 * from existing data.
 *
 * @param data - The virtual view data to load.
 */
export function loadVirtualViews(data: VirtualViewData[]): void {
  // Generate virtual view objects from the data
  const views: View[] = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
  }));

  // Load views into the store
  ViewsStore.load(views);

  // Dispatch a views loaded event
  Events.dispatch<ViewsLoadedEventData>(ViewsLoadedEvent, views);
}
