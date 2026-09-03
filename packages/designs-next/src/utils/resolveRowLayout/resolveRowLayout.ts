import { UnitPixelSize } from '../../constants';
import { BlockElement } from '../../types';

export interface RowLayout {
  /**
   * Pixel offset of each row's top edge.
   */
  tops: number[];

  /**
   * Total pixel height of all rows.
   */
  totalHeight: number;
}

/**
 * Resolves each row's pixel offset, stretching the rows spanned by
 * natural-height elements to fit their measured content so rows below
 * are pushed down. Rows only stretch, never shrink.
 *
 * @param elements - The card's elements.
 * @param rows - The card's row count.
 * @param naturalHeights - Measured pixel heights per natural element ID.
 * @returns The row layout.
 */
export function resolveRowLayout(
  elements: BlockElement[],
  rows: number,
  naturalHeights: Record<string, number>,
): RowLayout {
  // Start every row at its unit height
  const heights = new Array<number>(rows).fill(UnitPixelSize);

  // Stretch each natural element's rows evenly to fit its measured
  // height.
  elements.forEach((element) => {
    // Look up the element's measured content height
    const measured = naturalHeights[element.id];

    // Skip elements without a natural height or a measurement
    if (!element.naturalHeight || !measured) {
      return;
    }

    // Spread the measured height evenly across the element's rows,
    // only ever growing them.
    const perRow = measured / element.rowSpan;

    for (
      let row = element.row;
      row < Math.min(element.row + element.rowSpan, rows);
      row += 1
    ) {
      heights[row] = Math.max(heights[row], perRow);
    }
  });

  // Row tops are the cumulative heights of the rows above
  const tops: number[] = [0];

  heights.forEach((height, index) => {
    tops.push(tops[index] + height);
  });

  return { tops, totalHeight: tops[rows] };
}
