import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { ViewsStore } from '../ViewsStore';
import { ViewCreatedEvent, ViewCreatedEventData } from '../events';
import { getViewType } from '../getViewType';
import { CreateVirtualViewData, View } from '../types';

/**
 * Creates a virtual view that exists only in memory.
 * Virtual views are not persisted to the file system.
 *
 * @param viewData - The view data. Requires id, type, and dataSource. Name defaults to the view type name. Options are merged over the view type's default options.
 * @returns The created virtual view.
 *
 * @throws {ViewTypeNotRegisteredError} If the view type is not registered.
 *
 * @dispatches views:view:created
 */
export function createVirtualView(viewData: CreateVirtualViewData): View {
  // Get the view type
  const viewType = getViewType(viewData.type);

  // Generate the virtual view object
  const view: View = {
    id: viewData.id,
    virtual: true,
    dataSource: viewData.dataSource,
    type: viewData.type,
    name: viewData.name || i18n.t(viewType.name),
    icon: viewType.icon,
    created: new Date(),
    lastModified: new Date(),
  };

  // Merge view type default options with any provided options
  if (viewType?.defaultOptions || viewData.options) {
    view.options = { ...viewType?.defaultOptions, ...viewData.options };
  }

  // Set view data if provided
  if (viewData.data) {
    view.data = viewData.data;
  }

  // Add the view to the store
  ViewsStore.add(view);

  // Dispatch a view created event
  Events.dispatch<ViewCreatedEventData>(ViewCreatedEvent, view);

  return view;
}
