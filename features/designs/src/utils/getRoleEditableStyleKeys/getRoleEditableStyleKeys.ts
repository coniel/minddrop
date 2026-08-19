import { DesignRoles, isRoleElement } from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Resolves the style keys an element's role offers for editing, or
 * null when every key is offered: elements without a role, roles
 * which are no longer registered and roles without an editable
 * styles list all leave the editors unrestricted.
 *
 * @param element - The element to resolve editable keys for.
 * @returns The editable style keys, or null when unrestricted.
 */
export function getRoleEditableStyleKeys(
  element: FlatDesignElement,
): string[] | null {
  // Elements without a role restrict nothing
  if (!isRoleElement(element)) {
    return null;
  }

  // Look up the element's role, which may no longer be registered
  const role = DesignRoles.Store.get(element.role);

  // An unregistered role restricts nothing, matching how style
  // resolution degrades to the element's own style
  if (!role) {
    return null;
  }

  return role.editableStyles ?? null;
}
