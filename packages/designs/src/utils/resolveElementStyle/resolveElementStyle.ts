import { DesignRolesStore } from '../../DesignRolesStore';
import { DesignElementStyleSource } from '../../design-element-configs';
import { LayoutType } from '../../types';
import { isRoleElement } from '../isRoleElement';
import { resolveRoleStyle } from '../resolveRoleStyle';

/**
 * Resolves the effective style of an element: the element's own
 * style with its role's locked styles and each variant axis'
 * selected option applied over it, adapted to the given layout
 * context. Locked styles are merged at resolution time rather than
 * baked into the element, so re-theming a role centrally reaches
 * existing designs.
 *
 * @param element - The element whose style to resolve.
 * @param layoutType - The type of the layout the element is in.
 * @returns The effective element style.
 */
export function resolveElementStyle<TElement extends DesignElementStyleSource>(
  element: TElement,
  layoutType?: LayoutType,
): TElement['style'] {
  // Elements without a role use their own style as is
  if (!isRoleElement(element)) {
    return element.style;
  }

  // Look up the element's role
  const role = DesignRolesStore.get(element.role);

  // An unregistered role degrades to the element's own style
  if (!role) {
    return element.style;
  }

  // The element's own style with the role's context-resolved
  // styles applied over it. The registry erases the concrete style
  // shape, so restore it here.
  return {
    ...element.style,
    ...resolveRoleStyle(role, element.roleVariants, layoutType),
  } as TElement['style'];
}
