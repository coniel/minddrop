import {
  DesignElementStyleSource,
  RoleDesignElement,
} from '../design-element-configs';

/**
 * Checks whether an element plays a registered design role.
 */
export function isRoleElement<TElement extends DesignElementStyleSource>(
  element: TElement,
): element is TElement & Pick<RoleDesignElement, 'role' | 'roleVariants'> {
  return 'role' in element && typeof element.role === 'string';
}
