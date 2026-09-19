import { QueryNodeType } from '@minddrop/queries';
import { DropEventData } from '@minddrop/selection';
import { QueryNodeCardDataKey, QuerySourceCardDataKey } from '../../constants';

interface QueryToolbarCardDropData {
  [QuerySourceCardDataKey]?: boolean;
  [QueryNodeCardDataKey]?: QueryNodeType;
}

/**
 * Resolves the type of node a dropped toolbar card creates.
 *
 * @param drop - The drop.
 * @returns The node type to create, or null when the drop has no
 *   toolbar card.
 */
export function resolveDroppedQueryNodeType(
  drop: DropEventData,
): QueryNodeType | null {
  // Type the drop data as the toolbar card payloads
  const data = drop.data as QueryToolbarCardDropData | null;

  // Check if the source card was dropped. If so, it creates a source
  // node.
  if (data?.[QuerySourceCardDataKey]) {
    return 'source';
  }

  // Return the type a dropped node card creates, null without one
  return data?.[QueryNodeCardDataKey] ?? null;
}
