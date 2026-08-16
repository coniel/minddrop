import { Frame } from '@minddrop/ast';

/**
 * Resolves the containers a block sits inside after being indented.
 *
 * Markdown has nowhere to put a block which is nested deeper than the block
 * above it, so the block above decides what this one can nest inside, and an
 * indent which markdown cannot express does nothing.
 *
 * @param ancestry - The block's containers.
 * @param previousAncestry - The containers of the block above it.
 * @returns The block's new containers, or null if it cannot be indented.
 */
export function resolveIndentedAncestry(
  ancestry: Frame[],
  previousAncestry: Frame[],
): Frame[] | null {
  const innermost = ancestry[ancestry.length - 1];

  // A block at the top of the document has nothing to nest inside
  if (!previousAncestry.length) {
    return null;
  }

  // A block which opens its innermost container takes that container down a
  // level with it, nesting it inside whatever the block above it sits in
  if (innermost && previousAncestry[ancestry.length - 1]?.id !== innermost.id) {
    // The block above is not deep enough to nest inside
    if (previousAncestry.length < ancestry.length) {
      return null;
    }

    return [...previousAncestry.slice(0, ancestry.length), innermost];
  }

  // Any other block joins the container the block above it opened
  if (previousAncestry.length <= ancestry.length) {
    return null;
  }

  return previousAncestry.slice(0, ancestry.length + 1);
}
