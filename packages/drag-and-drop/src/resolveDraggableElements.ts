import { DraggablesRegistry } from './DraggablesRegistry';

/**
 * Resolves the elements rendered for a draggable item, each replaced
 * by its preview element when it has one. An item rendered in several
 * places resolves to all of them.
 *
 * @param id - The ID of the draggable item.
 * @returns The item's elements.
 */
export function resolveDraggableElements(id: string): Element[] {
  // Collect the sources dragging the item, each as its preview
  // element when it has one.
  return DraggablesRegistry.getAll()
    .filter((entry) => entry.getId() === id)
    .map((entry) => entry.resolvePreview() ?? entry.element);
}
