import { Element, Frame } from '@minddrop/ast';

/**
 * Returns the indexes of the blocks nested inside a block, being the run of
 * blocks after it which sit inside all of its containers.
 *
 * A container's blocks are contiguous, so the run ends at the first block
 * which has left them.
 *
 * @param elements - The document's blocks.
 * @param index - The block's index.
 * @returns The indexes of the nested blocks.
 */
export function resolveNestedBlockIndexes(
  elements: Element[],
  index: number,
): number[] {
  const ancestry = elements[index]?.ancestry || [];
  const nested: number[] = [];

  // A block which sits in no container has nothing nested inside it: every
  // block that follows is its sibling
  if (!ancestry.length) {
    return nested;
  }

  for (let next = index + 1; next < elements.length; next += 1) {
    const nextAncestry = elements[next].ancestry || [];

    // The block has left the containers, so the run has ended
    if (!isNestedIn(nextAncestry, ancestry)) {
      break;
    }

    nested.push(next);
  }

  return nested;
}

/**
 * Checks whether a block sits inside all of another block's containers.
 *
 * @param ancestry - The block's containers.
 * @param outerAncestry - The containers the block must sit inside.
 * @returns Whether the block is nested inside them.
 */
function isNestedIn(ancestry: Frame[], outerAncestry: Frame[]): boolean {
  if (ancestry.length < outerAncestry.length) {
    return false;
  }

  return outerAncestry.every((frame, depth) => ancestry[depth].id === frame.id);
}
