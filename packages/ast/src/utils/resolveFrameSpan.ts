import { Element } from '../types';

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
