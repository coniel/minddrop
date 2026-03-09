import { Events } from '@minddrop/events';
import { ViewsStore } from '../ViewsStore';
import { ViewCreatedEvent, ViewCreatedEventData } from '../events';
import { getViewType } from '../getViewType';
import { View, ViewDataSource } from '../types';

/**
 * Creates a virtual view that exists only in memory.
 * Virtual views are not persisted to the file system.
 *
 * @param id - The unique identifier for the view.
 * @param type - The type of view to create.
 * @param dataSource - The data source for the view.
 * @param name - The name of the view, defaults to the view type name.
 * @returns The created virtual view.
 *
 * @throws {ViewTypeNotRegisteredError} If the view type is not registered.
 *
 * @dispatches views:view:created
 */
export function createVirtualView(
  id: string,
  type: string,
  dataSource: ViewDataSource,
  name?: string,
): View {
  // Get the view type
  const viewType = getViewType(type);

  // Generate the virtual view object
  const view: View = {
    id,
    virtual: true,
    dataSource,
    type,
    name: name || viewType.type,
    icon: viewType.icon,
    created: new Date(),
    lastModified: new Date(),
  };

  // If the view type has default options, merge them into the view
  if (viewType?.defaultOptions) {
    view.options = { ...viewType.defaultOptions };
  }

  // Add the view to the store
  ViewsStore.add(view);

  // Dispatch a view created event
  Events.dispatch<ViewCreatedEventData>(ViewCreatedEvent, view);

  return view;
}
