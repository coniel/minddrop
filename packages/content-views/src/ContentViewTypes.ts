import { NotRegisteredError } from '@minddrop/stores';
import { ContentViewTypesRegistry } from './ContentViewTypesRegistry';
import {
  ContentViewTypeRegisteredEvent,
  ContentViewTypeUnregisteredEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Registered: ContentViewTypeRegisteredEvent,
  Unregistered: ContentViewTypeUnregisteredEvent,
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
} = ContentViewTypesRegistry;

export { registerContentViewType as register } from './registerContentViewType';
