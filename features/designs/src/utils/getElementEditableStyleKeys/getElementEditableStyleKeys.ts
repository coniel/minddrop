import {
  DesignRoles,
  getPropertyElementConfig,
  getPropertyElementVariant,
  isPropertyElement,
  isRoleElement,
} from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Resolves the style keys an element's role or property element
 * variant offers for editing, or null when every key is offered:
 * elements without a role, roles which are no longer registered
 * and roles or variants without an editable styles list all leave
 * the editors unrestricted.
 *
 * @param element - The element to resolve editable keys for.
 * @returns The editable style keys, or null when unrestricted.
 */
export function getElementEditableStyleKeys(
  element: FlatDesignElement,
): string[] | null {
  // Property elements offer their selected variant's editable keys
  if (isPropertyElement(element)) {
    const config = getPropertyElementConfig(element.propertyType, false);

    // A property type without a config restricts nothing, matching
    // how style resolution degrades to the element's own style
    if (!config) {
      return null;
    }

    return (
      getPropertyElementVariant(config, element.variant).editableStyles ?? null
    );
  }

  // Elements without a role restrict nothing
  if (!isRoleElement(element)) {
    return null;
  }

  // Look up the element's role, which may no longer be registered
  const role = DesignRoles.get(element.role, false);

  // An unregistered role restricts nothing, matching how style
  // resolution degrades to the element's own style
  if (!role) {
    return null;
  }

  return role.editableStyles ?? null;
}
