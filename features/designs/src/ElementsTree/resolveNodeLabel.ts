import {
  DesignRoles,
  getElementConfig,
  getPropertyElementConfig,
  isPropertyElement,
  isRoleElement,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { UiIconName } from '@minddrop/ui-icons';
import { FlatDesignElement } from '../types';

/**
 * How a tree node names the element it represents.
 */
export interface NodeLabel {
  /**
   * The i18n key of the element's name: its role's label when it
   * plays one, its element type's label otherwise.
   */
  label: TranslationKey;

  /**
   * The node's icon, taken from the role when it plays one.
   */
  icon: UiIconName;

  /**
   * The name of the design property the element is bound to, shown
   * as a chip after the label. Unset for unbound elements.
   */
  property?: string;

  /**
   * The element's static content, shown in place of a binding.
   * Unset for elements which are not static.
   */
  staticContent?: string;
}

/**
 * Resolves the name, icon and value an element is displayed with in
 * the layout tree.
 *
 * @param element - The element to describe.
 * @returns The element's tree node label.
 */
export function resolveNodeLabel(element: FlatDesignElement): NodeLabel {
  const config = getElementConfig(element.type);

  // Elements playing a role are named after it, falling back to the
  // element type when the role is not registered
  const role = isRoleElement(element)
    ? DesignRoles.get(element.role, false)
    : null;

  // Property elements are named after their property element
  // config, falling back to the element type when the property
  // type has none
  const propertyElementConfig = isPropertyElement(element)
    ? getPropertyElementConfig(element.propertyType, false)
    : null;

  const nodeLabel: NodeLabel = {
    label: role?.label ?? propertyElementConfig?.label ?? config.label,
    icon: role?.icon ?? propertyElementConfig?.icon ?? config.icon,
  };

  // Static elements display their own content rather than a binding
  if (element.static) {
    nodeLabel.staticContent =
      'content' in element ? element.content : undefined;

    return nodeLabel;
  }

  // Bound elements display the property they render
  if (element.property) {
    nodeLabel.property = element.property;
  }

  return nodeLabel;
}
