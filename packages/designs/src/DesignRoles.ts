import { DesignRoleNotRegisteredError } from './errors';
import {
  DesignRoleRegisteredEvent,
  DesignRoleUnregisteredEvent,
} from './events';
import { BuiltInDesignRoles } from './roles';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Registered: DesignRoleRegisteredEvent,
  Unregistered: DesignRoleUnregisteredEvent,
} as const;

export const errors = {
  NotRegistered: DesignRoleNotRegisteredError,
};

export const constants = {
  BuiltIn: BuiltInDesignRoles,
};

export { DesignRolesStore as Store } from './DesignRolesStore';
export { registerDesignRole as register } from './registerDesignRole';
export { unregisterDesignRole as unregister } from './unregisterDesignRole';
export { getDesignRole as get } from './getDesignRole';
export { getCompatibleDesignRoles as getCompatible } from './getCompatibleDesignRoles';
export {
  useDesignRole as use,
  useDesignRoles as useAll,
} from './DesignRolesStore';
export { createRoleElement as createElement } from './createRoleElement';
export {
  getRoleVariantAxes as getVariantAxes,
  resolveRoleStyle as resolveStyle,
} from './utils';
