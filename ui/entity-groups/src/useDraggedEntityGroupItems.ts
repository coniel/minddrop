import { useMemo } from 'react';
import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { Selection } from '@minddrop/selection';
import { resolveAcceptedEntityGroupItems } from './utils';

/**
 * Returns the IDs of the entities currently being dragged which a
 * group of the type can hold. Empty while nothing is being dragged,
 * and while what is being dragged has no business in one of the
 * type's groups.
 *
 * @param config - The config of the group type.
 * @returns The IDs of the dragged entities the type accepts.
 */
export function useDraggedEntityGroupItems(
  config: EntityGroupTypeConfig,
): string[] {
  const selection = Selection.use();
  const isDragging = Selection.useIsDragging();

  return useMemo(() => {
    if (!isDragging) {
      return [];
    }

    return resolveAcceptedEntityGroupItems(
      selection.map((item) => item.id),
      config,
    );
  }, [isDragging, selection, config]);
}
