import { DragOrigin } from '@minddrop/drag-and-drop';
import { EntityGroups } from '@minddrop/entity-groups';

/**
 * Resolves the ID of the group of the given type the dragged items
 * were dragged out of, or null when they came from outside the
 * type's groups: out of another type's group, out of the ungrouped
 * group, or from no group at all.
 *
 * @param origin - Where the drag started from.
 * @param type - The group type of the drop target.
 * @returns The ID of the group the items came from.
 */
export function resolveEntityGroupDragSourceId(
  origin: DragOrigin | null,
  type: string,
): string | null {
  // Check if the drag started in one of the type's groups. If not,
  // the items came from outside them.
  if (!origin || origin.type !== type) {
    return null;
  }

  // Check if the drag started in the ungrouped group. If so, the
  // items left no group.
  if (origin.id === EntityGroups.constants.UngroupedId) {
    return null;
  }

  return origin.id;
}
