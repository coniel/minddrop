import { NotRegisteredError } from '@minddrop/stores';
import { DesignElementConfigsRegistry } from './DesignElementConfigsRegistry';
import { DesignElementConfigRegisteredEvent } from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Registered: DesignElementConfigRegisteredEvent,
} as const;

export const errors = {
  NotRegistered: NotRegisteredError,
};

export const {
  store: Store,
  get,
  getAll,
  use,
  useAll,
} = DesignElementConfigsRegistry;

export { registerDesignElementConfig as register } from './registerDesignElementConfig';
