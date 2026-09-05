import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewCreatedEvent } from '../events';
import { extractDataViewReferences } from '../extractDataViewReferences';
import { getDataViewType } from '../getDataViewType';
import { DataView, ViewDataSource } from '../types';
import { toContentIcon } from '../utils';
import { writeDataView } from '../writeDataView';

/**
 * Creates a new data view of the specified type.
 *
 * @param type - The type of data view to create.
 * @param dataSource - The data source for the data view.
 * @param name - The name of the data view, defaults to the data view type name.
 * @returns The created data view.
 *
 * @throws {DataViewTypeNotRegisteredError} If the data view type is not registered.
 *
 * @dispatches data-views:data-view:created
 */
export async function createDataView(
  type: string,
  dataSource: ViewDataSource,
  name?: string,
): Promise<DataView> {
  // Get the data view type
  const viewType = getDataViewType(type);

  // Create the data view with the data view type's default icon
  const view: DataView = {
    id: entityId('data-view'),
    dataSource,
    type: type,
    name: name || i18n.t(viewType.name),
    icon: toContentIcon(viewType.icon),
    created: new Date(),
    lastModified: new Date(),
  };

  // If the data view type has default options, merge them into the data view
  if (viewType?.defaultOptions) {
    view.options = { ...viewType.defaultOptions, ...view.options };
  }

  // If the data view type has default data, merge it into the data view
  if (viewType?.defaultData) {
    view.data = { ...viewType.defaultData };
  }

  // Index the item references within the view's config
  view.references = extractDataViewReferences(view.type, {
    options: view.options,
    data: view.data,
  });

  // Add the data view to the store
  DataViewsStore.set(view);

  // Dispatch a data view created event
  Events.dispatch(DataViewCreatedEvent, view);

  // Write the data view to the file system
  await writeDataView(view.id);

  return view;
}
