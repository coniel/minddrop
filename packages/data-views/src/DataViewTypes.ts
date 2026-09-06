import { DataViewTypeNotRegisteredError } from './errors';
import {
  DataViewTypeRegisteredEvent,
  DataViewTypeUnregisteredEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  Registered: DataViewTypeRegisteredEvent,
  Unregistered: DataViewTypeUnregisteredEvent,
} as const;

export const errors = {
  NotRegistered: DataViewTypeNotRegisteredError,
};

export {
  DataViewTypesStore as Store,
  useDataViewType as use,
  useDataViewTypes as useAll,
} from './DataViewTypesStore';
export { registerDataViewType as register } from './registerDataViewType';
export { unregisterDataViewType as unregister } from './unregisterDataViewType';
export { getDataViewType as get } from './getDataViewType';
export { getDataViewTypes as getAll } from './getDataViewTypes';
