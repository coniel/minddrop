import { Events } from '@minddrop/events';
import {
  InvalidParameterError,
  deepMerge as deepMergeFn,
} from '@minddrop/utils';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewUpdatedEvent } from '../events';
import { extractContentViewReferences } from '../extractContentViewReferences';
import { getContentView } from '../getContentView';
import {
  ContentView,
  UpdateContentViewData,
  UpdateVirtualContentViewData,
} from '../types';
import { writeContentView } from '../writeContentView';

/**
 * Updates a content view, performing a deep merge by default.
 *
 * @param id - The ID of the content view to update.
 * @param data - The data to update the content view with.
 * @param deepMerge - Whether to deep merge the update data with the existing content view data.
 * @param workspaceId - The workspace the content view belongs to. Omit for the active workspace.
 * @returns The updated content view.
 *
 * @throws {ContentViewNotFoundError} If the content view with the specified ID does not exist.
 * @throws {InvalidParameterError} If attempting to change the ID of a non-virtual content view.
 *
 * @dispatches content-views:content-view:updated
 */
export async function updateContentView(
  id: string,
  data: UpdateContentViewData | UpdateVirtualContentViewData,
  deepMerge = true,
  workspaceId?: string,
): Promise<ContentView> {
  const store = ContentViewsStore.in(workspaceId);

  // Get the content view
  const view = getContentView(id, true, workspaceId);

  // Update the content view
  const update = { ...data, lastModified: new Date() };
  const updatedView: ContentView = deepMerge
    ? deepMergeFn(view, update)
    : { ...view, ...update };

  // Re-index the item references within the updated config
  updatedView.references = extractContentViewReferences(updatedView.type, {
    options: updatedView.options,
    data: updatedView.data,
  });

  // If the ID is changing (virtual content views only), remove the old
  // entry and set the new one.
  if ('id' in data && data.id && data.id !== id) {
    if (!view.virtual) {
      throw new InvalidParameterError(
        'Cannot change the ID of a non-virtual view',
      );
    }

    store.remove(id);
    store.set(updatedView);
  } else {
    // Update the content view in the store
    store.update(id, updatedView);
  }

  // Get the updated content view from the store
  const finalView = getContentView(updatedView.id, true, workspaceId);

  // Dispatch a content view updated event
  Events.dispatch(ContentViewUpdatedEvent, {
    original: view,
    updated: finalView,
  });

  // Write the content view to the file system if not virtual
  if (!view.virtual) {
    await writeContentView(id, workspaceId);
  }

  // Return the updated content view
  return finalView;
}
