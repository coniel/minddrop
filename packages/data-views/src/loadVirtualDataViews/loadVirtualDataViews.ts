import { Events } from '@minddrop/events';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewsLoadedEvent } from '../events';
import { extractDataViewReferences } from '../extractDataViewReferences';
import { DataView, VirtualDataViewData } from '../types';

/**
 * Loads virtual data views into the store without dispatching
 * creation events. Use this when hydrating virtual data views
 * from existing data.
 *
 * @param data - The virtual data view data to load.
 * @param workspaceId - The ID of the workspace the data views belong to.
 */
export function loadVirtualDataViews(
  data: VirtualDataViewData[],
  workspaceId: string,
): void {
  // Generate virtual data view objects from the data
  const views: DataView[] = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
    // Index the item references within the view's config
    references: extractDataViewReferences(item.type, {
      options: item.options,
      data: item.data,
    }),
  }));

  // Load the data views into the workspace's store record
  DataViewsStore.in(workspaceId).load(views);

  // Dispatch a data views loaded event
  Events.dispatch(DataViewsLoadedEvent, views);
}
