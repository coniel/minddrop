import {
  DesignRoles,
  LayoutType,
  getPropertyElementConfig,
  getPropertyElementVariant,
  isPropertyElement,
  isRoleElement,
  resolvePropertyElementStyle,
  resolveRoleStyle,
} from '@minddrop/designs';
import { FlatDesignElement } from '../../types';

/**
 * Resolves the style keys an element's role or property element
 * variant controls in the given layout context, which the style
 * editors must not offer for editing. Covers the locked styles
 * plus the styles of the option currently selected on each variant
 * axis, since both are applied over the element's own style at
 * resolution time and would silently win over any user edit.
 *
 * @param element - The element to resolve locked keys for.
 * @param layoutType - The type of the layout the element is in.
 * @returns The set of locked style keys.
 */
export function getElementLockedStyleKeys(
  element: FlatDesignElement,
  layoutType?: LayoutType,
): Set<string> {
  // Property elements lock the theme style keys their variant's
  // editable whitelist does not cover; whitelisted theme keys act
  // as overridable defaults
  if (isPropertyElement(element)) {
    const config = getPropertyElementConfig(element.propertyType, false);

    // A property type without a config locks nothing, matching how
    // style resolution degrades to the element's own style
    if (!config) {
      return new Set();
    }

    // The whitelist the theme keys are checked against
    const editableStyles = getPropertyElementVariant(
      config,
      element.variant,
    ).editableStyles;

    // Without a whitelist every key is editable, so nothing locks
    if (!editableStyles) {
      return new Set();
    }

    // Theme keys outside the whitelist are locked
    return new Set(
      Object.keys(
        resolvePropertyElementStyle(config, element.variant, layoutType),
      ).filter((key) => !editableStyles.includes(key)),
    );
  }

  // Elements without a role lock nothing
  if (!isRoleElement(element)) {
    return new Set();
  }

  // Look up the element's role, which may no longer be registered
  const role = DesignRoles.get(element.role, false);

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
