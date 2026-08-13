import { DesignRolesStore } from '../../DesignRolesStore';
import { DesignElement } from '../../design-element-configs';
import { isRoleElement } from '../isRoleElement';

/**
 * Resolves the effective style of an element: the element's own
 * style with its role's locked styles and each variant axis'
 * selected option applied over it. Locked styles are merged at
 * resolution time rather than baked into the element, so re-theming
 * a role centrally reaches existing designs.
 *
 * @param element - The element whose style to resolve.
 * @returns The effective element style.
 */
export function resolveElementStyle<TElement extends DesignElement>(
  element: TElement,
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

  // Start from the element's own style with the role's locked
  // styles applied over it
  let style = { ...element.style, ...role.lockedStyle };

  // Apply each axis' selected option, falling back to the axis
  // default when omitted or unknown
  role.variants?.forEach((axis) => {
    const selected = element.roleVariants?.[axis.id] ?? axis.defaultOption;
    const option =
      axis.options.find((candidate) => candidate.id === selected) ??
      axis.options.find((candidate) => candidate.id === axis.defaultOption);

    if (option) {
      style = { ...style, ...option.style };
    }
  });

  // The registry erases the concrete style shape, so restore it here
  return style as TElement['style'];
}
