import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent } from '../events';
import { getView } from '../getView';
import { View } from '../types';
import { writeViewConfig } from '../writeViewConfig';

export type UpdateViewData = Partial<Pick<View, 'name' | 'content'>>;

/**
 * Updates a view, updating it in the store and writing it to the file system.
 *
 * @param viewId - The ID of the view to update.
 * @param data - The view data.
 * @returns The updated view.
 *
 * @dispatches 'views:view:updated' event
 */
export async function updateView(
  viewId: string,
  data: UpdateViewData,
): Promise<View> {
  // Get the view
  const view = getView(viewId);

  // Update the view
  const updatedView: View = {
    ...view,
    ...data,
  };

  // Update the view in the store
  ViewsStore.update(viewId, updatedView);

  // Write the view config to the file system
  await writeViewConfig(viewId);

  // Dispatch the view updated event
  Events.dispatch(ViewUpdatedEvent, { original: view, updated: updatedView });

  return updatedView;
}
