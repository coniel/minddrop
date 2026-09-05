import {
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
} from '../../constants';
import { CanvasViewNode } from '../../types';
import { getUnplacedNodePositions } from '../getUnplacedNodePositions';

/**
 * Reconciles saved canvas nodes with the current list of entries.
 * - Entry nodes whose entry is no longer in the collection are
 *   removed.
 * - Entries present in the collection but not placed on the
 *   canvas are appended at deterministic positions below the
 *   placed nodes, except duplicates whose in-flight placement
 *   hint puts them below their original.
 * - Non-entry nodes pass through untouched.
 *
 * @param nodes - The saved canvas nodes.
 * @param entries - The IDs of the entries in the view's collection.
 * @param duplicateOriginals - Unplaced duplicate entry IDs mapped to their original's ID.
 * @returns The reconciled nodes.
 */
export function reconcileNodes(
  nodes: CanvasViewNode[],
  entries: string[],
  duplicateOriginals: Record<string, string> = {},
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

  // Place duplicates below their original while their placement
  // is in flight.
  const duplicateNodes: CanvasViewNode[] = [];
  const gridPlaced: string[] = [];

  unplaced.forEach((entryId) => {
    const original = filtered.find(
      (node) =>
        node.type === 'entry' && node.id === duplicateOriginals[entryId],
    );

    // Fall back to the auto-placed grid when the entry is no
    // duplicate or its original is not on the canvas.
    if (!original) {
      gridPlaced.push(entryId);

      return;
    }

    // Mirror the persisted placement: horizontally centered on
    // the original, directly below it.
    duplicateNodes.push({
      type: 'entry',
      id: entryId,
      x: Math.round(original.x + original.width / 2 - DEFAULT_NODE_WIDTH / 2),
      y: original.y + (original.height ?? ESTIMATED_NODE_HEIGHT) + NODE_GAP,
      width: DEFAULT_NODE_WIDTH,
    });
  });

  // Append nodes for the other unplaced entries at deterministic
  // positions
  const positions = getUnplacedNodePositions(filtered, gridPlaced.length);
  const unplacedNodes = gridPlaced.map<CanvasViewNode>((entryId, index) => ({
    type: 'entry',
    id: entryId,
    x: positions[index].x,
    y: positions[index].y,
    width: DEFAULT_NODE_WIDTH,
  }));

  return [...filtered, ...duplicateNodes, ...unplacedNodes];
}
