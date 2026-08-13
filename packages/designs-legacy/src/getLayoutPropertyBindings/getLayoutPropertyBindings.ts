import { DesignElement, Layout } from '../types';
import { elementTitleBindingId } from '../utils';

/**
 * Collects the design property bindings of a layout's elements.
 *
 * @param layout - The layout whose element bindings to collect.
 * @returns An [element ID]: [design property name] map.
 */
export function getLayoutPropertyBindings(
  layout: Layout,
): Record<string, string> {
  const bindings: Record<string, string> = {};

  collectBindings(layout.tree, bindings);

  return bindings;
}

/**
 * Adds the element's binding (and those of its descendants) to
 * the bindings map.
 */
function collectBindings(
  element: DesignElement,
  bindings: Record<string, string>,
): void {
  if (element.property) {
    bindings[element.id] = element.property;
  }

  // Editor elements can have a second, title-suffixed binding
  if (element.type === 'editor' && element.titleProperty) {
    bindings[elementTitleBindingId(element.id)] = element.titleProperty;
  }

  if ('children' in element) {
    element.children.forEach((child) => collectBindings(child, bindings));
  }
}
