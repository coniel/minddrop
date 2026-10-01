import { clamp } from '@minddrop/utils';
import { DesignElement } from '../../types';
import { resolveChildElements } from '../resolveChildElements';
import { resolveContextElements } from '../resolveContextElements';
import { resolveScaledWidths } from '../resolveScaledWidths';
import { resolveScalingColumns } from '../resolveScalingColumns';

/**
 * Remaps element columns to a new design column count, element by
 * element against each element's own context. Non-scaling columns
 * (gaps and fixed elements) keep their single-unit width while
 * scaling columns share the remaining units proportionally, so edge
 * offsets, inter-element gaps, and fixed element widths stay fixed
 * and fluid element span ratios are preserved. Elements held by
 * another element are returned unchanged.
 *
 * @param elements - The design's elements.
 * @param oldColumns - The current column count.
 * @param newColumns - The target column count.
 * @returns The elements with columns and spans remapped.
 */
export function remapElementColumns<TElement extends DesignElement>(
  elements: TElement[],
  oldColumns: number,
  newColumns: number,
): TElement[] {
  // Check if there is anything to remap. Without elements or a column
  // count change, the elements are returned as-is.
  if (elements.length === 0 || oldColumns === newColumns) {
    return elements;
  }

  // Resolve the elements on the design's own grid
  const ownElements = resolveChildElements(elements);

  // Remap each of the design's own elements against its own context
  return elements.map((element) => {
    // Check if the element is held by another. If so, leave it as it
    // is, since its parent places it.
    if (element.parent) {
      return element;
    }

    // Classify column scaling against the element's context
    const context = resolveContextElements(element, ownElements);
    const scaling = resolveScalingColumns([element, ...context], oldColumns);
    const scalingCount = scaling.filter(Boolean).length;
    const fixedCount = oldColumns - scalingCount;

    // With nothing to scale, just clamp into the new bounds
    if (scalingCount === 0) {
      const columnSpan = Math.min(element.columnSpan, newColumns);

      return {
        ...element,
        columnSpan,
        column: clamp(element.column, 0, newColumns - columnSpan),
      };
    }

    // Units left for scaling columns after fixed columns keep theirs
    const targetScalingTotal = Math.max(newColumns - fixedCount, 0);

    // Scale each scaling column's width, fixed columns stay at one unit
    const widths = resolveScaledWidths(scaling, targetScalingTotal);

    // Map old unit boundaries to new positions via cumulative widths
    const boundaries: number[] = [0];

    widths.forEach((width, index) => {
      boundaries.push(boundaries[index] + width);
    });

    // Remap the element's edges through the boundary positions
    const start = boundaries[element.column];
    const end = boundaries[element.column + element.columnSpan];
    const columnSpan = Math.max(end - start, 1);

    return {
      ...element,
      column: clamp(start, 0, newColumns - 1),
      columnSpan: Math.min(columnSpan, newColumns),
    };
  });
}
