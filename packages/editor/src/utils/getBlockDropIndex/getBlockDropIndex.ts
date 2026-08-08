/**
 * Works out which insertion point dragged blocks would drop into,
 * from the block under the pointer.
 *
 * @param blockIndex The index of the block under the pointer.
 * @param blockBounds The block's vertical bounds, in pixels.
 * @param pointerY The pointer's distance from the top of the viewport, in pixels.
 * @param contentStartIndex The index of the editor's first content block.
 * @returns The index the blocks would be inserted at.
 */
export function getBlockDropIndex(
  blockIndex: number,
  blockBounds: { top: number; height: number },
  pointerY: number,
  contentStartIndex: number,
): number {
  // The half of the block the pointer is over decides which of its
  // sides the blocks drop on
  const after = pointerY > blockBounds.top + blockBounds.height / 2;
  const index = after ? blockIndex + 1 : blockIndex;

  // Blocks never drop above the title
  return Math.max(index, contentStartIndex);
}
