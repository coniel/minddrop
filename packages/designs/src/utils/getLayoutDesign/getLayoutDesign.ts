import { DesignsStore } from '../../DesignsStore';
import { Design } from '../../types';

/**
 * Finds the design containing the given layout.
 *
 * @param layoutId - The ID of the layout.
 * @returns The parent design, or null when no design contains the layout.
 */
export function getLayoutDesign(layoutId: string): Design | null {
  // Scan every design for one containing the layout
  return (
    DesignsStore.getAllArray().find((design) =>
      design.layouts.some((layout) => layout.id === layoutId),
    ) ?? null
  );
}
