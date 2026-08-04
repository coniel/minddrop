import { Layouts } from '@minddrop/designs';
import { PropertyMap } from '@minddrop/properties';

/**
 * Removes property values not bound to any element in the layout.
 *
 * @param layoutId - The ID of the layout whose bound properties to keep.
 * @param properties - The property values to prune.
 * @returns The pruned property values.
 */
export function prunePageProperties(
  layoutId: string,
  properties: PropertyMap,
): PropertyMap {
  // Get the layout
  const layout = Layouts.get(layoutId, false);

  // The layout cannot be resolved, leave the properties untouched
  if (!layout) {
    return { ...properties };
  }

  // Collect the property names bound in the layout
  const boundProperties = new Set(
    Object.values(Layouts.getPropertyBindings(layout)),
  );

  // Drop values for properties that do not appear in the layout
  return Object.fromEntries(
    Object.entries(properties).filter(([name]) => boundProperties.has(name)),
  );
}
