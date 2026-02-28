import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewCreatedEvent, ViewCreatedEventData } from '../events';
import { getViewType } from '../getViewType';
import { View, ViewDataSource } from '../types';
import { writeView } from '../writeView';

/**
 * Creates a new view of the specified type.
 *
 * @param type - The type of view to create.
 * @param dataSource - The data source for the view.
 * @param name - The name of the view, defaults to the view type name.
 * @returns The created view.
 *
 * @throws {ViewTypeNotRegisteredError} If the view type is not registered.
 *
 * @dispatches views:view:created
 */
export async function createView(
  type: string,
  dataSource: ViewDataSource,
  name?: string,
): Promise<View> {
  // Get the view type
  const viewType = getViewType(type);

  // Create the view with the view type's default icon
  const view: View = {
    id: uuid(),
    dataSource,
    type: type,
    name: name || i18n.t(viewType.name),
    icon: viewType.icon,
    created: new Date(),
    lastModified: new Date(),
  };

  // If the view type has a default options, merge them into the view
  if (viewType?.defaultOptions) {
    view.options = { ...viewType.defaultOptions, ...view.options };
  }

  // Add the view to the store
  ViewsStore.add(view);

  // Write the view to the file system
  await writeView(view.id);

  // Dispatch a view created event
  Events.dispatch<ViewCreatedEventData>(ViewCreatedEvent, view);

  return view;
}
