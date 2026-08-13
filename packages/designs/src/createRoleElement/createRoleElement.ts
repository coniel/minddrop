import { createElement } from '../createElement';
import { RoleDesignElement } from '../design-element-configs';
import { getDesignRole } from '../getDesignRole';
import { Design, Layout } from '../types';
import { resolveAutoBinding } from '../utils/resolveAutoBinding';

/**
 * Creates a new design element playing the given role: an instance
 * of the role's base element type carrying the role ID, auto-bound
 * to the first compatible unbound design property. The role's locked
 * styles are not baked in; they apply at style resolution time.
 *
 * @param roleId - The ID of the role to instantiate.
 * @param design - The design the element is created in.
 * @param layout - The layout the element is inserted into.
 * @returns The new role element.
 *
 * @throws {DesignRoleNotRegisteredError} If the role is not registered.
 */
export function createRoleElement(
  roleId: string,
  design: Design,
  layout: Layout,
): RoleDesignElement {
  // Get the role, throwing if it isn't registered
  const role = getDesignRole(roleId);

  // Instantiate the role's base element type with the role tag
  const element: RoleDesignElement = {
    ...createElement(role.elementType),
    role: role.id,
  };

  // Resolve the property the element should auto-bind to
  const property = role.bindsPropertyTypes
    ? resolveAutoBinding(design, layout, role.bindsPropertyTypes)
    : null;

  // Bind the element when a compatible unbound property exists
  if (property) {
    element.property = property;
  }

  return element;
}
