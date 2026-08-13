import { DesignElement, RoleDesignElement } from '../design-element-configs';

/**
 * Checks whether an element plays a registered design role.
 */
export function isRoleElement<TElement extends DesignElement>(
  element: TElement,
): element is RoleDesignElement<TElement> {
  return 'role' in element && typeof element.role === 'string';
}
