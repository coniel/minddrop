import { Element } from '@minddrop/ast';

/**
 * Checks whether a block opens its innermost container, rather than carrying
 * one the block above it opened.
 *
 * A container is opened by the first block whose ancestry holds it, which is
 * the block its marker is drawn against.
 *
 * @param elements - The document's blocks.
 * @param index - The block's index.
 * @returns Whether the block opens its innermost container.
 */
export function opensInnermostFrame(
  elements: Element[],
  index: number,
): boolean {
  const ancestry = elements[index]?.ancestry || [];
  const innermost = ancestry[ancestry.length - 1];

  // A block in no container opens nothing
  if (!innermost) {
    return false;
  }

  const previousAncestry = elements[index - 1]?.ancestry || [];

  return previousAncestry[ancestry.length - 1]?.id !== innermost.id;
}
