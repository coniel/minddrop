import { Layout, Layouts } from '@minddrop/designs';
import { PropertyMap } from '@minddrop/properties';

/**
 * Removes property values not bound to any element in the layout.
 *
 * @param layout - The layout whose bound properties to keep.
 * @param properties - The property values to prune.
 * @returns The pruned property values.
 */
export function prunePageProperties(
  layout: Layout,
  properties: PropertyMap,
): PropertyMap {
  // Collect the property names bound in the layout
  const boundProperties = new Set(
    Object.values(Layouts.getPropertyBindings(layout)),
  );

  // Drop values for properties that do not appear in the layout
  return Object.fromEntries(
    Object.entries(properties).filter(([name]) => boundProperties.has(name)),
  );
}
