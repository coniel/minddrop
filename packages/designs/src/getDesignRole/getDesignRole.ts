import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleNotRegisteredError } from '../errors';
import { DesignRoleConfig } from '../types';

/**
 * Retrieves a registered design role by its ID.
 *
 * @param id - The ID of the role to retrieve.
 * @returns The role config.
 *
 * @throws {DesignRoleNotRegisteredError} If the role is not registered.
 */
export function getDesignRole(id: string): DesignRoleConfig {
  // Get the role from the registry
  const role = DesignRolesStore.get(id);

  // Guard against unregistered roles
  if (!role) {
    throw new DesignRoleNotRegisteredError(id);
  }

  return role;
}
