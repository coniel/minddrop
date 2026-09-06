import { DesignElementConfigNotRegisteredError } from './errors';
import { DesignElementConfigRegisteredEvent } from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  Registered: DesignElementConfigRegisteredEvent,
} as const;

export const errors = {
  NotRegistered: DesignElementConfigNotRegisteredError,
};

export {
  DesignElementConfigsStore as Store,
  useDesignElementConfig as use,
  useDesignElementConfigs as useAll,
} from './DesignElementConfigsStore';
export { registerDesignElementConfig as register } from './registerDesignElementConfig';
export { getDesignElementConfig as get } from './getDesignElementConfig';
export { getDesignElementConfigs as getAll } from './getDesignElementConfigs';
