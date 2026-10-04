import { QueryNodeType } from '@minddrop/queries';
import { DropEventData } from '@minddrop/selection';
import { QueryNodeCardDataKey } from '../../constants';

interface QueryToolbarCardDropData {
  [QueryNodeCardDataKey]?: Exclude<QueryNodeType, 'source' | 'results'>;
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
): Exclude<QueryNodeType, 'source' | 'results'> | null {
  // Type the drop data as the toolbar card payload
  const data = drop.data as QueryToolbarCardDropData | null;

  // Return the type a dropped node card creates, null without one
  return data?.[QueryNodeCardDataKey] ?? null;
}
