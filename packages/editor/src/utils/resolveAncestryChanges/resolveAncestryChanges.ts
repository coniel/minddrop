import { Element, Frame } from '@minddrop/ast';
import { resolveNestedBlockIndexes } from '../resolveNestedBlockIndexes';

/**
 * Resolves the containers a block sits inside after being moved between
 * them, or null if it cannot move.
 */
export type AncestryResolver = (
  ancestry: Frame[],
  previousAncestry: Frame[],
) => Frame[] | null;

/**
 * Resolves the new containers of every block a move between containers
 * affects, keyed by block index.
 *
 * Moving a block moves everything nested inside it, which is what keeps a
 * list item's own blocks and its child items attached to it.
 *
 * @param elements - The document's blocks.
 * @param indexes - The indexes of the blocks being moved.
 * @param resolveAncestry - Resolves a single block's new containers.
 * @returns The new containers of each affected block.
 */
export function resolveAncestryChanges(
  elements: Element[],
  indexes: number[],
  resolveAncestry: AncestryResolver,
): Map<number, Frame[]> {
  const changes = new Map<number, Frame[]>();

  // Resolved in document order, so that a block reads the block above it as
  // it stands after that block has moved
  [...indexes].sort(compareIndexes).forEach((index) => {
    const element = elements[index];

    // The block has already moved as part of an outer block's nesting
    if (!element || changes.has(index)) {
      return;
    }

    const ancestry = element.ancestry || [];
    const previousAncestry =
      changes.get(index - 1) ?? elements[index - 1]?.ancestry ?? [];
    const nextAncestry = resolveAncestry(ancestry, previousAncestry);

    // The move is one markdown cannot express, so the block stays put
    if (!nextAncestry) {
      return;
    }

    changes.set(index, nextAncestry);

    // Everything nested inside the block follows it, keeping the containers
    // it opened around its own content
    resolveNestedBlockIndexes(elements, index).forEach((nestedIndex) => {
      const nestedAncestry = elements[nestedIndex].ancestry || [];

      changes.set(nestedIndex, [
        ...nextAncestry,
        ...nestedAncestry.slice(ancestry.length),
      ]);
    });
  });

  return changes;
}

/**
 * Orders block indexes by their position in the document.
 *
 * @param index - The first index.
 * @param otherIndex - The second index.
 * @returns The sort order.
 */
function compareIndexes(index: number, otherIndex: number): number {
  return index - otherIndex;
}
