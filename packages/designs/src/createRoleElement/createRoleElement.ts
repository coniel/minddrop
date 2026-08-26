import { createElement } from '../createElement';
import { RoleDesignElement } from '../design-element-configs';
import { getDesignRole } from '../getDesignRole';

/**
 * Creates a new design element playing the given role: an instance
 * of the role's base element type carrying the role ID. The role's
 * locked styles are not baked in; they apply at style resolution
 * time.
 *
 * @param roleId - The ID of the role to instantiate.
 * @returns The new role element.
 *
 * @throws {DesignRoleNotRegisteredError} If the role is not registered.
 */
export function createRoleElement(roleId: string): RoleDesignElement {
  // Get the role, throwing if it isn't registered
  const role = getDesignRole(roleId);

  // Instantiate the role's base element type with the role tag
  return {
    ...createElement(role.elementType),
    role: role.id,
  };
}
