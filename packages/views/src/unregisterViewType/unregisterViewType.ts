import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeNotRegisteredError } from '../errors';
import { ViewTypeUnregisteredEvent } from '../events';

/**
 * Unregisters a view type, removing it from the store.
 *
 * @param type - The type of the view type to unregister.
 *
 * @throws {ViewTypeNotRegisteredError} If the view type is not registered.
 *
 * @dispatches 'views:view-type:unregistered' event
 */
export function unregisterViewType(type: string): void {
  // Get the view type
  const viewType = ViewTypesStore.get(type);

  // Ensure the view type is registered
  if (!viewType) {
    throw new ViewTypeNotRegisteredError(type);
  }

  // Remove the view type from the store
  ViewTypesStore.remove(type);

  // Dispatch the view type unregistered event
  Events.dispatch(ViewTypeUnregisteredEvent, type);
}
