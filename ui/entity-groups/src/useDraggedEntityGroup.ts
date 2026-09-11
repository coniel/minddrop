import { EntityGroups } from '@minddrop/entity-groups';
import { Selection } from '@minddrop/selection';

/**
 * Returns the ID of the group currently being dragged, or null when
 * the drag is something else or a group of another type.
 *
 * @param type - The group type.
 * @returns The ID of the dragged group.
 */
export function useDraggedEntityGroup(type: string): string | null {
  const selection = Selection.use();
  const isDragging = Selection.useIsDragging();
  const groups = EntityGroups.useAll(type);

  if (!isDragging || selection.length !== 1) {
    return null;
  }

  const dragged = groups.find((group) => group.id === selection[0].id);

  return dragged?.id ?? null;
}
