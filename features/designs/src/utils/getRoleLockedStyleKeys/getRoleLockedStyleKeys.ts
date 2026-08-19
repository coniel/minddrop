import {
  DesignRoles,
  LayoutType,
  isRoleElement,
  resolveRoleStyle,
} from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Resolves the style keys an element's role controls in the given
 * layout context, which the style editors must not offer for
 * editing. Covers the role's locked styles plus the styles of the
 * option currently selected on each variant axis, since both are
 * applied over the element's own style at resolution time and
 * would silently win over any user edit.
 *
 * @param element - The element to resolve locked keys for.
 * @param layoutType - The type of the layout the element is in.
 * @returns The set of locked style keys.
 */
export function getRoleLockedStyleKeys(
  element: FlatDesignElement,
  layoutType?: LayoutType,
): Set<string> {
  // Elements without a role lock nothing
  if (!isRoleElement(element)) {
    return new Set();
  }

  // Look up the element's role, which may no longer be registered
  const role = DesignRoles.Store.get(element.role);

  // An unregistered role locks nothing, matching how style
  // resolution degrades to the element's own style
  if (!role) {
    return new Set();
  }

  // Every key the role's context-resolved style applies is locked
  return new Set(
    Object.keys(resolveRoleStyle(role, element.roleVariants, layoutType)),
  );
}
