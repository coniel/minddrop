import { DEFAULT_NODE_WIDTH } from '../../constants';
import { CanvasViewNode } from '../../types';
import { getUnplacedNodePositions } from '../getUnplacedNodePositions';

/**
 * Reconciles saved canvas nodes with the current list of entries.
 * - Entry nodes whose entry is no longer in the collection are
 *   removed.
 * - Entries present in the collection but not placed on the
 *   canvas are appended at deterministic positions below the
 *   placed nodes.
 * - Non-entry nodes pass through untouched.
 *
 * @param nodes - The saved canvas nodes.
 * @param entries - The IDs of the entries in the view's collection.
 * @returns The reconciled nodes.
 */
export function reconcileNodes(
  nodes: CanvasViewNode[],
  entries: string[],
): CanvasViewNode[] {
  const entrySet = new Set(entries);
  const placedEntries = new Set<string>();

  // Filter out entry nodes whose entry no longer exists in the
  // collection
  const filtered = nodes.filter((node) => {
    if (node.type !== 'entry') {
      return true;
    }

    if (entrySet.has(node.id)) {
      placedEntries.add(node.id);

      return true;
    }

    return false;
  });

  // Entries in the collection which have no node yet
  const unplaced = entries.filter((entryId) => !placedEntries.has(entryId));

  if (!unplaced.length) {
    return filtered;
  }

  // Append nodes for the unplaced entries at deterministic
  // positions
  const positions = getUnplacedNodePositions(filtered, unplaced.length);
  const unplacedNodes = unplaced.map<CanvasViewNode>((entryId, index) => ({
    type: 'entry',
    id: entryId,
    x: positions[index].x,
    y: positions[index].y,
    width: DEFAULT_NODE_WIDTH,
  }));

  return [...filtered, ...unplacedNodes];
}
