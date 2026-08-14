import { Element, Frame, ListItemFrame } from '../types';

/**
 * Returns the number of leading frames two blocks have in common, which is
 * the depth at which their containers diverge.
 *
 * @param ancestry - The first block's ancestry.
 * @param otherAncestry - The second block's ancestry.
 * @returns The shared depth.
 */
export function resolveSharedFrameDepth(
  ancestry: Frame[] = [],
  otherAncestry: Frame[] = [],
): number {
  let depth = 0;

  while (
    depth < ancestry.length &&
    depth < otherAncestry.length &&
    ancestry[depth].id === otherAncestry[depth].id
  ) {
    depth += 1;
  }

  return depth;
}

/**
 * Returns the innermost list item a block sits inside, if any.
 *
 * @param ancestry - The block's ancestry.
 * @returns The innermost list item frame, or null.
 */
export function resolveInnermostListItem(
  ancestry: Frame[] = [],
): ListItemFrame | null {
  for (let index = ancestry.length - 1; index >= 0; index -= 1) {
    const frame = ancestry[index];

    if (frame.kind === 'list-item') {
      return frame;
    }
  }

  return null;
}

/**
 * Determines whether two adjacent items belong to the same list.
 *
 * Markdown has no list token to compare: a run of adjacent items is one
 * list until the marker changes, so the marker is the list's identity.
 *
 * @param item - The preceding item.
 * @param nextItem - The following item.
 * @returns Whether the items are in the same list.
 */
export function isSameList(
  item: ListItemFrame,
  nextItem: ListItemFrame,
): boolean {
  return (
    item.ordered === nextItem.ordered &&
    item.marker === nextItem.marker &&
    (item.indent || '') === (nextItem.indent || '')
  );
}

/**
 * Returns the contiguous run of blocks belonging to a frame.
 *
 * A frame's blocks are contiguous in document order, guaranteed by markdown
 * itself, so the span is a forward scan from the frame's first block.
 *
 * @param elements - The document's blocks.
 * @param frameId - The frame whose span to resolve.
 * @returns The indexes of the frame's blocks.
 */
export function resolveFrameSpan(
  elements: Element[],
  frameId: string,
): number[] {
  const span: number[] = [];

  for (let index = 0; index < elements.length; index += 1) {
    const isInFrame = (elements[index].ancestry || []).some(
      (frame) => frame.id === frameId,
    );

    if (isInFrame) {
      span.push(index);
      continue;
    }

    // The run has ended, so nothing further belongs to the frame
    if (span.length) {
      break;
    }
  }

  return span;
}
