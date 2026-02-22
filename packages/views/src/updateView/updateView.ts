import { Events } from '@minddrop/events';
import { deepMerge as deepMergeFn } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent, ViewUpdatedEventData } from '../events';
import { getView } from '../getView';
import { View } from '../types';
import { writeView } from '../writeView';

type UpdateViewData = Partial<
  Pick<View, 'name' | 'options' | 'databaseDesignMap' | 'entryDesignMap'>
>;

/**
 * Updates a view, performing a deep merge by default.
 *
 * @param id - The ID of the view to update.
 * @param data - The data to update the view with.
 * @param deepMerge - Whether to deep merge the update data with the existing view data.
 * @returns The updated view.
 *
 * @throws {ViewNotFoundError} If the view with the specified ID does not exist.
 *
 * @dispatches views:view:updated
 */
export async function updateView(
  id: string,
  data: UpdateViewData,
  deepMerge = true,
): Promise<View> {
  // Get the view
  const view = getView(id);

  // Update the view in the store
  const update = { ...data, lastModified: new Date() };
  ViewsStore.update(id, deepMerge ? deepMergeFn(view, update) : update);

  // Write the view to the file system
  await writeView(id);

  // Get the updated view
  const updatedView = getView(id);

  // Dispatch a view updated event
  Events.dispatch<ViewUpdatedEventData>(ViewUpdatedEvent, {
    original: view,
    updated: updatedView,
  });

  // Return the updated view
  return updatedView;
}
