import { Frame } from '@minddrop/ast';

/**
 * Resolves the containers a block sits inside after being outdented.
 *
 * A block which opens a container takes it along, so an item steps out to
 * sit alongside the item which held it. Any other block simply leaves the
 * container it is in.
 *
 * @param ancestry - The block's containers.
 * @param previousAncestry - The containers of the block above it.
 * @returns The block's new containers, or null if it sits in none.
 */
export function resolveOutdentedAncestry(
  ancestry: Frame[],
  previousAncestry: Frame[],
): Frame[] | null {
  const innermost = ancestry[ancestry.length - 1];

  if (!innermost) {
    return null;
  }

  const opensInnermost =
    previousAncestry[ancestry.length - 1]?.id !== innermost.id;

  // A block which opens its innermost container leaves the container around
  // it, keeping its own
  if (opensInnermost && ancestry.length > 1) {
    return [...ancestry.slice(0, -2), innermost];
  }

  return ancestry.slice(0, -1);
}
