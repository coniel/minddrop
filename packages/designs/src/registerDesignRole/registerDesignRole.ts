import { Events } from '@minddrop/events';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleRegisteredEvent } from '../events';
import { DesignRoleConfig } from '../types';

/**
 * Registers a design role, adding it to the role registry.
 *
 * @param role - The role config to register.
 *
 * @dispatches 'designs:role:registered' event
 */
export function registerDesignRole(role: DesignRoleConfig): void {
  // Add the role to the registry
  DesignRolesStore.set(role);

  // Dispatch the role registered event
  Events.dispatch(DesignRoleRegisteredEvent, role);
}
