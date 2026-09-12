import { DataViewEntityType, DataViewsIcon } from './constants';
import { DataViewNotFoundError } from './errors';
import {
  DataViewCreatedEvent,
  DataViewDeletedEvent,
  DataViewUpdatedEvent,
  DataViewsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: DataViewCreatedEvent,
  Updated: DataViewUpdatedEvent,
  Deleted: DataViewDeletedEvent,
  Loaded: DataViewsLoadedEvent,
} as const;

export const errors = {
  NotFound: DataViewNotFoundError,
};

export const constants = {
  EntityType: DataViewEntityType,
  Icon: DataViewsIcon,
};

export { initializeDataViews as initialize } from './initializeDataViews';
export { loadWorkspaceDataViews as loadWorkspace } from './loadWorkspaceDataViews';
export { createDataView as create } from './createDataView';
export { createVirtualDataView as createVirtual } from './createVirtualDataView';
export { loadVirtualDataViews as loadVirtual } from './loadVirtualDataViews';
export { deleteDataView as delete } from './deleteDataView';
export { getDataView as get } from './getDataView';
export { getDataSourceDataViews as getByDataSource } from './getDataSourceDataViews';
export { getDataViewsOfType as getOfType } from './getDataViewsOfType';
export { getOwnedDataViews as getByOwner } from './getOwnedDataViews';
export { getReferencingDataViews as getReferencing } from './getReferencingDataViews';
export { removeDataViewReferences as removeReferences } from './removeDataViewReferences';
export { readDataView as read } from './readDataView';
export {
  searchDataViews as search,
  resolveViewFilePath as resolveFilePath,
} from './utils';
export { serializeDataView as serialize } from './serializeDataView';
export { deserializeDataView as deserialize } from './deserializeDataView';
export { serializeDataViewConfig as serializeConfig } from './serializeDataViewConfig';
export { resolveDataViewConfig as resolveConfig } from './resolveDataViewConfig';
export { updateDataView as update } from './updateDataView';
export { updateDataViewOptions as updateOptions } from './updateDataViewOptions';
export { updateDataViewData as updateData } from './updateDataViewData';
export { writeDataView as write } from './writeDataView';
export {
  DataViewsStore as Store,
  useDataView as use,
  useDataViews as useAll,
  useDataViewsOfType as useOfType,
  useDataSourceDataViews,
} from './DataViewsStore';
