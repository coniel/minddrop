import { Events } from '@minddrop/events';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleUnregisteredEvent } from '../events';
import { getDesignRole } from '../getDesignRole';

/**
 * Unregisters a design role, removing it from the role registry.
 *
 * @param id - The ID of the role to unregister.
 *
 * @dispatches 'designs:role:unregistered' event
 *
 * @throws {DesignRoleNotRegisteredError} If the role is not registered.
 */
export function unregisterDesignRole(id: string): void {
  // Get the role, throwing if it isn't registered
  const role = getDesignRole(id);

  // Remove the role from the registry
  DesignRolesStore.remove(id);

  // Dispatch the role unregistered event
  Events.dispatch(DesignRoleUnregisteredEvent, role);
}
