import { Events } from '@minddrop/events';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewsLoadedEvent } from '../events';
import { extractContentViewReferences } from '../extractContentViewReferences';
import { ContentView, VirtualContentViewData } from '../types';

/**
 * Loads virtual content views into the store without dispatching
 * creation events. Use this when hydrating virtual content views
 * from existing data.
 *
 * @param data - The virtual content view data to load.
 * @param workspaceId - The ID of the workspace the content views belong to.
 */
export function loadVirtualContentViews(
  data: VirtualContentViewData[],
  workspaceId: string,
): void {
  // Generate virtual content view objects from the data
  const views: ContentView[] = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
    // Index the item references within the view's config
    references: extractContentViewReferences(item.type, {
      options: item.options,
      data: item.data,
    }),
  }));

  // Load the content views into the workspace's store record
  ContentViewsStore.in(workspaceId).load(views);

  // Dispatch a content views loaded event
  Events.dispatch(ContentViewsLoadedEvent, views);
}
