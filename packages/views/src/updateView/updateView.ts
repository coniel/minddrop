import { Events } from '@minddrop/events';
import {
  InvalidParameterError,
  deepMerge as deepMergeFn,
} from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent, ViewUpdatedEventData } from '../events';
import { getView } from '../getView';
import { UpdateViewData, UpdateVirtualViewData, View } from '../types';
import { writeView } from '../writeView';

/**
 * Updates a view, performing a deep merge by default.
 *
 * @param id - The ID of the view to update.
 * @param data - The data to update the view with.
 * @param deepMerge - Whether to deep merge the update data with the existing view data.
 * @returns The updated view.
 *
 * @throws {ViewNotFoundError} If the view with the specified ID does not exist.
 * @throws {InvalidParameterError} If attempting to change the ID of a non-virtual view.
 *
 * @dispatches views:view:updated
 */
export async function updateView(
  id: string,
  data: UpdateViewData | UpdateVirtualViewData,
  deepMerge = true,
): Promise<View> {
  // Get the view
  const view = getView(id);

  // Update the view
  const update = { ...data, lastModified: new Date() };
  const updatedView: View = deepMerge
    ? deepMergeFn(view, update)
    : { ...view, ...update };

  // If the ID is changing (virtual views only), remove the old
  // entry and set the new one
  if ('id' in data && data.id && data.id !== id) {
    if (!view.virtual) {
      throw new InvalidParameterError(
        'Cannot change the ID of a non-virtual view',
      );
    }

    ViewsStore.remove(id);
    ViewsStore.set(updatedView);
  } else {
    // Update the view in the store
    ViewsStore.update(id, deepMerge ? deepMergeFn(view, update) : update);
  }

  // Write the view to the file system if not virtual
  if (!view.virtual) {
    await writeView(id);
  }

  // Get the updated view from the store
  const finalView = getView(updatedView.id);

  // Dispatch a view updated event
  Events.dispatch<ViewUpdatedEventData>(ViewUpdatedEvent, {
    original: view,
    updated: finalView,
  });

  // Return the updated view
  return finalView;
}
