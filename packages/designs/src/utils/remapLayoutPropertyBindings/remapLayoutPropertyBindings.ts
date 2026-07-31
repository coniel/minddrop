import { DesignElement, Layout } from '../../types';

/**
 * Updates element bindings of the given design property across
 * the layouts: rebinds bound elements to the new property name,
 * or unbinds them when the new name is null.
 *
 * @param layouts - The layouts whose element bindings to update.
 * @param propertyName - The bound design property name to update.
 * @param newPropertyName - The new property name, or null to unbind.
 * @returns The layouts with updated element bindings.
 */
export function remapLayoutPropertyBindings(
  layouts: Layout[],
  propertyName: string,
  newPropertyName: string | null,
): Layout[] {
  return layouts.map((layout) => ({
    ...layout,
    tree: {
      ...layout.tree,
      property: remapBinding(
        layout.tree.property,
        propertyName,
        newPropertyName,
      ),
      children: layout.tree.children.map((child) =>
        remapElement(child, propertyName, newPropertyName),
      ),
    },
  }));
}

/**
 * Returns the element with its binding (and those of its
 * descendants) remapped.
 */
function remapElement(
  element: DesignElement,
  propertyName: string,
  newPropertyName: string | null,
): DesignElement {
  const property = remapBinding(
    element.property,
    propertyName,
    newPropertyName,
  );

  if ('children' in element) {
    return {
      ...element,
      property,
      children: element.children.map((child) =>
        remapElement(child, propertyName, newPropertyName),
      ),
    };
  }

  return { ...element, property };
}

/**
 * Returns the remapped value for a single binding: the new
 * property name (or undefined when unbinding) if the binding
 * matches the renamed property, the original binding otherwise.
 */
function remapBinding(
  binding: string | undefined,
  propertyName: string,
  newPropertyName: string | null,
): string | undefined {
  if (binding !== propertyName) {
    return binding;
  }

  return newPropertyName || undefined;
}
