import { DesignRolesStore } from '../DesignRolesStore';
import { DesignRoleNotRegisteredError } from '../errors';
import { DesignRoleConfig } from '../types';

/**
 * Retrieves a registered design role by its ID.
 *
 * @param id - The ID of the role to retrieve.
 * @param throwOnNotFound - Whether to throw when the role is not registered. Defaults to true.
 * @returns The role config, or null when not registered and not throwing.
 *
 * @throws {DesignRoleNotRegisteredError} If the role is not registered and throwing is enabled.
 */
export function getDesignRole(
  id: string,
  throwOnNotFound?: true,
): DesignRoleConfig;
export function getDesignRole(
  id: string,
  throwOnNotFound: false,
): DesignRoleConfig | null;
export function getDesignRole(
  id: string,
  throwOnNotFound = true,
): DesignRoleConfig | null {
  // Get the role from the registry
  const role = DesignRolesStore.get(id);

  // Guard against unregistered roles
  if (!role) {
    if (throwOnNotFound) {
      throw new DesignRoleNotRegisteredError(id);
    }

    return null;
  }

  return role;
}
