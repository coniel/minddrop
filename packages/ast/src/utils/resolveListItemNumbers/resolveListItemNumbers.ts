import { Element, ListItemFrame } from '../../types';
import { isSameList } from '../isSameList';

interface OrderedRun {
  /**
   * The frame the run's items sit inside, so a nested list restarts when
   * its parent item changes.
   */
  parentId: string;

  /**
   * The run's first item, which its later items are compared against.
   */
  item: ListItemFrame;

  /**
   * The number the run's next item takes.
   */
  nextNumber: number;
}

/**
 * Computes the displayed number of every ordered list item in the document.
 *
 * There is no wrapping list element to count, so numbering runs over the
 * items themselves: a run continues while adjacent items share a marker and
 * a parent, and breaks on anything else. The run's first item sets its
 * start, which is the only number CommonMark honours.
 *
 * @param elements - The document's blocks.
 * @returns The displayed number of each ordered item frame, keyed by frame id.
 */
export function resolveListItemNumbers(
  elements: Element[],
): Map<string, number> {
  const numbers = new Map<string, number>();
  // The run open at each ancestry depth, since a document can have a list
  // inside a list
  const runs: (OrderedRun | null)[] = [];
  // Items already numbered, so an item's continuation blocks do not advance
  // its list
  const numberedItems = new Set<string>();

  elements.forEach((element) => {
    const ancestry = element.ancestry || [];

    ancestry.forEach((frame, depth) => {
      // Anything which is not an ordered item ends the run at its depth
      if (frame.kind !== 'list-item' || !frame.ordered) {
        runs[depth] = null;

        return;
      }

      // A continuation block of an item which already has its number
      if (numberedItems.has(frame.id)) {
        return;
      }

      numberedItems.add(frame.id);

      const parentId = depth > 0 ? ancestry[depth - 1].id : '';
      const run = runs[depth];

      // The item continues the open run
      if (run && run.parentId === parentId && isSameList(run.item, frame)) {
        numbers.set(frame.id, run.nextNumber);
        run.nextNumber += 1;

        return;
      }

      // The item opens a new list, whose number it sets the start from
      const start = frame.number ?? 1;

      numbers.set(frame.id, start);
      runs[depth] = { parentId, item: frame, nextNumber: start + 1 };
    });

    // Depths the block does not reach have been left, so their runs end
    for (let depth = ancestry.length; depth < runs.length; depth += 1) {
      runs[depth] = null;
    }
  });

  return numbers;
}
