import { Element, Frame } from '@minddrop/ast';
import { uuid } from '@minddrop/utils';

/**
 * Finds a container whose blocks have been split apart and returns the
 * ancestry changes which put the document back together.
 *
 * A container is drawn around a run of lines, so markdown cannot express one
 * whose blocks are interrupted. Where an edit has split one, the blocks after
 * the break become a container of their own.
 *
 * Only the first split found is repaired, the next pass finding any others.
 *
 * @param elements - The document's blocks.
 * @returns The new containers of each affected block, or null if none are split.
 */
export function resolveSplitFrameRepair(
  elements: Element[],
): Map<number, Frame[]> | null {
  // The containers the previous block sat inside, and those whose run has
  // already ended
  let openIds: string[] = [];
  const closedIds = new Set<string>();

  for (let index = 0; index < elements.length; index += 1) {
    const ancestry = elements[index].ancestry || [];
    const ids = ancestry.map((frame) => frame.id);
    const split = ancestry.find((frame) => closedIds.has(frame.id));

    if (split) {
      return resolveRepair(elements, index, split);
    }

    // A container the block has left cannot be reopened further down
    openIds.forEach((id) => {
      if (!ids.includes(id)) {
        closedIds.add(id);
      }
    });

    openIds = ids;
  }

  return null;
}

/**
 * Builds the ancestry changes which give a split container a new identity
 * from the block the break left it at.
 *
 * @param elements - The document's blocks.
 * @param index - The index of the block which reopened the container.
 * @param split - The container which was split.
 * @returns The new containers of each affected block.
 */
function resolveRepair(
  elements: Element[],
  index: number,
  split: Frame,
): Map<number, Frame[]> {
  const changes = new Map<number, Frame[]>();
  const replacement: Frame = { ...split, id: uuid() };

  for (let next = index; next < elements.length; next += 1) {
    const ancestry = elements[next].ancestry || [];

    // The run of blocks carrying the split container has ended
    if (!ancestry.some((frame) => frame.id === split.id)) {
      break;
    }

    changes.set(
      next,
      ancestry.map((frame) => (frame.id === split.id ? replacement : frame)),
    );
  }

  return changes;
}
