import { Events } from '@minddrop/events';
import { ViewTypesStore } from '../ViewTypesStore';
import { ViewTypeRegisteredEvent } from '../events';
import { ViewType } from '../types';

/**
 * Registers a view type, adding it to the store.
 *
 * @param viewType - The view type to register.
 *
 * @dispatches 'views:view-type:registered' event
 */
export function registerViewType(viewType: ViewType<any>) {
  // Add the view type to the store
  ViewTypesStore.add(viewType);

  // Dispatch the view type registered event
  Events.dispatch(ViewTypeRegisteredEvent, viewType);
}
