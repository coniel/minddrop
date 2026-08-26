import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewCreatedEvent } from '../events';
import { extractDataViewReferences } from '../extractDataViewReferences';
import { getDataViewType } from '../getDataViewType';
import { CreateVirtualDataViewData, DataView } from '../types';
import { toContentIcon } from '../utils';

/**
 * Creates a virtual data view that exists only in memory.
 * Virtual data views are not persisted to the file system.
 *
 * @param viewData - The data view data. Requires id, type, and dataSource. Name defaults to the data view type name. Options are merged over the data view type's default options.
 * @returns The created virtual data view.
 *
 * @throws {DataViewTypeNotRegisteredError} If the data view type is not registered.
 *
 * @dispatches data-views:data-view:created
 */
export function createVirtualDataView(
  viewData: CreateVirtualDataViewData,
): DataView {
  // Get the data view type
  const viewType = getDataViewType(viewData.type);

  // Generate the virtual data view object
  const view: DataView = {
    id: viewData.id,
    virtual: true,
    dataSource: viewData.dataSource,
    type: viewData.type,
    name: viewData.name || i18n.t(viewType.name),
    icon: toContentIcon(viewType.icon),
    created: new Date(),
    lastModified: new Date(),
  };

  // Merge data view type default options with any provided options
  if (viewType?.defaultOptions || viewData.options) {
    view.options = { ...viewType?.defaultOptions, ...viewData.options };
  }

  // Set data view data if provided
  if (viewData.data) {
    view.data = viewData.data;
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

  return view;
}
