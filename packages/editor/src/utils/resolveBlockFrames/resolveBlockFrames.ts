import { Element, Frame, resolveListItemNumbers } from '@minddrop/ast';
import { hasBlockId } from '../block-id';

export interface RenderedFrame {
  /**
   * The container the block sits inside.
   */
  frame: Frame;

  /**
   * Whether the block is the frame's first block, which is where the
   * container's marker is drawn.
   */
  isFirstBlock: boolean;

  /**
   * Whether the block is the frame's last block, which is where the
   * container's affordances stop.
   */
  isLastBlock: boolean;

  /**
   * The number displayed for an ordered list item frame.
   */
  number?: number;
}

export type BlockFrames = Map<string, RenderedFrame[]>;

/**
 * Resolves how each block's containers are drawn, keyed by block ID.
 *
 * Frames are ancestry data rather than nodes, so a block cannot tell on its
 * own whether it opens or closes a container, or which number an ordered
 * item takes. Both are decided by the blocks around it, so they are resolved
 * for the document as a whole.
 *
 * Blocks with no containers are left out.
 *
 * @param elements - The document's blocks.
 * @returns The rendered frames of each framed block.
 */
export function resolveBlockFrames(elements: Element[]): BlockFrames {
  const numbers = resolveListItemNumbers(elements);
  const blockFrames: BlockFrames = new Map();

  elements.forEach((element, index) => {
    const ancestry = element.ancestry || [];

    // Only framed blocks with an ID can be looked up while rendering
    if (!ancestry.length || !hasBlockId(element)) {
      return;
    }

    const previousAncestry = elements[index - 1]?.ancestry || [];
    const nextAncestry = elements[index + 1]?.ancestry || [];

    blockFrames.set(
      element.id,
      ancestry.map((frame, depth) => ({
        frame,
        // A container is opened by the first block whose ancestry holds it
        // at this depth, and closed by the last
        isFirstBlock: previousAncestry[depth]?.id !== frame.id,
        isLastBlock: nextAncestry[depth]?.id !== frame.id,
        number: resolveFrameNumber(frame, numbers),
      })),
    );
  });

  return blockFrames;
}

/**
 * Builds a signature of everything which changes how a document's frames are
 * drawn, used to keep the resolved frames stable while only block content
 * changes.
 *
 * @param elements - The document's blocks.
 * @returns The signature.
 */
export function resolveBlockFramesSignature(elements: Element[]): string {
  return elements
    .map((element) => {
      const ancestry = element.ancestry || [];
      const id = hasBlockId(element) ? element.id : '';

      return [id, ...ancestry.map(describeFrame)].join('|');
    })
    .join(',');
}

/**
 * Returns the number an ordered list item frame displays.
 *
 * @param frame - The frame.
 * @param numbers - The displayed number of each ordered item frame.
 * @returns The number, or undefined for frames which are not numbered.
 */
function resolveFrameNumber(
  frame: Frame,
  numbers: Map<string, number>,
): number | undefined {
  if (frame.kind !== 'list-item' || !frame.ordered) {
    return undefined;
  }

  return numbers.get(frame.id);
}

/**
 * Describes a frame for the document signature.
 *
 * @param frame - The frame.
 * @returns The frame's description.
 */
function describeFrame(frame: Frame): string {
  if (frame.kind === 'blockquote') {
    return `q${frame.id}`;
  }

  if (frame.kind === 'footnote-definition') {
    return `f${frame.id}:${frame.label ?? frame.identifier}`;
  }

  return [
    `l${frame.id}`,
    frame.ordered ? 'o' : 'u',
    frame.marker,
    frame.number ?? '',
    frame.checked === undefined ? '' : String(frame.checked),
  ].join(':');
}
