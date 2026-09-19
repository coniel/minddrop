import { useMemo } from 'react';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import {
  resolveAcceptedEntityGroupItemIds,
  resolveDraggedItemIds,
} from './utils';

/**
 * Returns the IDs of the entities being dragged which the type's
 * groups accept. Empty while nothing is being dragged, and while the
 * type accepts none of what is being dragged. A type which takes no
 * items from outside its groups only takes drags out of one of them.
 *
 * @param config - The config of the group type.
 * @returns The IDs of the dragged entities the type accepts.
 */
export function useDraggedEntityGroupItemIds(
  config: EntityGroupTypeConfig,
): string[] {
  // The drag in progress, if any
  const drag = DragAndDrop.useActiveDrag();

  return useMemo(() => {
    if (!drag) {
      return [];
    }

    // Check if the type takes items from outside its groups. If not,
    // only a drag out of one of them counts.
    if (!config.acceptsExternalItems && drag.origin?.type !== config.id) {
      return [];
    }

    // Resolve the dragged items the type accepts
    return resolveAcceptedEntityGroupItemIds(
      resolveDraggedItemIds(drag.data, config.itemTypes),
      config,
    );
  }, [drag, config]);
}
