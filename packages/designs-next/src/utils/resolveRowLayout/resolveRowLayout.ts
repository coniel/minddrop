import { UnitPixelSize } from '../../constants';
import { DesignElement } from '../../types';

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
 * Resolves each row's pixel offset, stretching or shrinking the rows
 * spanned by content-fitted elements to fit their measured content
 * so rows below move with them. A row spanned by several elements
 * takes the tallest height among them, and a row no element spans
 * keeps its unit height.
 *
 * @param elements - The card's elements.
 * @param rows - The card's row count.
 * @param measuredHeights - Measured pixel heights per fitted element ID.
 * @returns The row layout.
 */
export function resolveRowLayout(
  elements: DesignElement[],
  rows: number,
  measuredHeights: Record<string, number>,
): RowLayout {
  // The tallest height an element spanning each row needs, unset
  // for rows no element spans.
  const demands = new Array<number | undefined>(rows).fill(undefined);

  elements.forEach((element) => {
    // The height the element needs from each of its rows
    const perRow = resolveRowHeight(element, measuredHeights[element.id]);

    for (
      let row = element.row;
      row < Math.min(element.row + element.rowSpan, rows);
      row += 1
    ) {
      demands[row] = Math.max(demands[row] ?? 0, perRow);
    }
  });

  // Row tops are the cumulative heights of the rows above
  const tops: number[] = [0];

  demands.forEach((demand, index) => {
    tops.push(tops[index] + (demand ?? UnitPixelSize));
  });

  return { tops, totalHeight: tops[rows] };
}

/**
 * Resolves the height an element needs from each row it spans: its
 * measured content spread evenly across its rows, bounded by its
 * content fit.
 *
 * @param element - The element.
 * @param measured - The element's measured content height, if any.
 * @returns The height per row in pixels.
 */
function resolveRowHeight(
  element: DesignElement,
  measured: number | undefined,
): number {
  const contentFit = element.contentFit ?? 'fixed';

  // Fixed and unmeasured elements hold their unit height
  if (contentFit === 'fixed' || measured === undefined) {
    return UnitPixelSize;
  }

  const perRow = measured / element.rowSpan;

  if (contentFit === 'grow') {
    return Math.max(UnitPixelSize, perRow);
  }

  if (contentFit === 'shrink') {
    return Math.min(UnitPixelSize, perRow);
  }

  return perRow;
}
