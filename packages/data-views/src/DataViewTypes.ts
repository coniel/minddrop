import { NotRegisteredError } from '@minddrop/stores';
import { DataViewTypesRegistry } from './DataViewTypesRegistry';
import {
  DataViewTypeRegisteredEvent,
  DataViewTypeUnregisteredEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Registered: DataViewTypeRegisteredEvent,
  Unregistered: DataViewTypeUnregisteredEvent,
} as const;

export const errors = {
  NotRegistered: NotRegisteredError,
};

export const {
  store: Store,
  unregister,
  get,
  getAll,
  use,
  useAll,
} = DataViewTypesRegistry;

export { registerDataViewType as register } from './registerDataViewType';
