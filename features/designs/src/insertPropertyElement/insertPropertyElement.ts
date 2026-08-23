import { createPropertyElement } from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { DesignStudioStore } from '../DesignStudioStore';
import { FlatDesignElement } from '../types';
import { isStudioRootPanelled } from '../utils';

/**
 * Inserts a new property element for the given property type into
 * a layout, auto-bound to the first compatible unbound design
 * property, and selects it. Does nothing when the layout or design
 * cannot be resolved.
 *
 * @param studio - The design studio store instance.
 * @param propertyType - The property type to insert an element for.
 * @param parentId - The ID of the parent element to insert into.
 * @param index - The index to insert the element at.
 * @param layoutId - The ID of the layout to insert into. Falls back to the active layout when omitted.
 */
export function insertPropertyElement(
  studio: DesignStudioStore,
  propertyType: PropertyType,
  parentId: string,
  index: number,
  layoutId?: string,
): void {
  const design = studio.getDesign();

  // Property elements are instantiated against the design being
  // edited
  if (!design) {
    return;
  }

  // Fall back to the active layout when no layout is given
  const resolvedLayoutId = layoutId ?? studio.getActiveLayoutId();

  // Auto-binding needs the layout's existing bindings, taken from
  // the live elements so that properties bound since the last save
  // are already counted as taken
  const layout = studio.getLiveLayout(resolvedLayoutId ?? undefined);

  if (!layout) {
    return;
  }

  // New elements can't be dropped into the panel row itself
  if (parentId === 'root' && isStudioRootPanelled(studio, resolvedLayoutId)) {
    return;
  }

  // Instantiate the property element, auto-bound to a compatible
  // unbound property
  const element = createPropertyElement(propertyType, design, layout);

  // Flatten the new element for the studio's element map
  const flatElement: FlatDesignElement = { ...element, parent: parentId };

  studio.addElement(flatElement, parentId, index, layoutId);
  studio.selectElement(flatElement.id, layoutId);
  studio.saveDesign();
}
