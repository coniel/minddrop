import { Element } from '@minddrop/ast';
import { BlockRange } from '../getBlockAlignedRange';
import { resolveNestedBlockIndexes } from '../resolveNestedBlockIndexes';

/**
 * Extends a range of blocks to cover everything nested inside them.
 *
 * A container is drawn around its blocks, so selecting the block which
 * opens one and leaving its contents behind would select something the
 * document does not contain. Selecting a nested block on its own is fine:
 * closure only runs downwards.
 *
 * @param elements - The document's blocks.
 * @param range - The range to close.
 * @returns The closed range.
 */
export function resolveClosedBlockRange(
  elements: Element[],
  range: BlockRange,
): BlockRange {
  let { lastIndex } = range;

  // A block pulled into the range can itself hold nested blocks, so the
  // range keeps growing until nothing new is drawn in
  for (let index = range.firstIndex; index <= lastIndex; index += 1) {
    const nested = resolveNestedBlockIndexes(elements, index);

    if (nested.length) {
      lastIndex = Math.max(lastIndex, nested[nested.length - 1]);
    }
  }

  return { firstIndex: range.firstIndex, lastIndex };
}
