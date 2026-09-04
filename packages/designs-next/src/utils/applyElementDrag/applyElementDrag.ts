import { DesignElement } from '../../types';
import { snapToMultiple } from '../snapToMultiple';

export type ElementDragMode =
  | 'move'
  | 'resize-left'
  | 'resize-right'
  | 'resize-top'
  | 'resize-bottom'
  | 'resize-top-left'
  | 'resize-top-right'
  | 'resize-bottom-left'
  | 'resize-bottom-right';

export interface ApplyElementDragOptions {
  /**
   * The drag interaction being performed.
   */
  mode: ElementDragMode;

  /**
   * Unsnapped horizontal drag delta in grid units.
   */
  deltaColumns: number;

  /**
   * Unsnapped vertical drag delta in grid units.
   */
  deltaRows: number;

  /**
   * The design's column count.
   */
  columns: number;

  /**
   * The design's row count.
   */
  rows: number;

  /**
   * The snap resolution in grid units.
   */
  snap: number;
}

/**
 * Applies a drag delta to an element, clamped to the design's grid
 * bounds. Moves snap the element's edges onto the snap grid so
 * off-grid placements heal, while resizes snap the delta so the
 * untouched edges stay put. Corner modes drag both of their edges.
 *
 * @param element - The element as it was at drag start.
 * @param options - The drag interaction and grid context.
 * @returns The element with the delta applied.
 */
export function applyElementDrag<TElement extends DesignElement>(
  element: TElement,
  options: ApplyElementDragOptions,
): TElement {
  const { mode, deltaColumns, deltaRows, columns, rows, snap } = options;

  // Snap the element's edges onto the snap grid, keeping it inside
  // the design bounds.
  if (mode === 'move') {
    return {
      ...element,
      column: clamp(
        snapToMultiple(element.column + deltaColumns, snap),
        0,
        columns - element.columnSpan,
      ),
      row: clamp(
        snapToMultiple(element.row + deltaRows, snap),
        0,
        rows - element.rowSpan,
      ),
    };
  }

  // Snap the drag delta so the untouched edges stay put
  const snappedColumns = snapToMultiple(deltaColumns, snap);
  const snappedRows = snapToMultiple(deltaRows, snap);

  let resized = { ...element };

  // Move the left edge while keeping the right edge in place
  if (mode.includes('left')) {
    const column = clamp(
      element.column + snappedColumns,
      0,
      element.column + element.columnSpan - 1,
    );

    resized = {
      ...resized,
      column,
      columnSpan: element.column + element.columnSpan - column,
    };
  }

  // Grow or shrink from the right edge
  if (mode.includes('right')) {
    resized = {
      ...resized,
      columnSpan: clamp(
        element.columnSpan + snappedColumns,
        1,
        columns - element.column,
      ),
    };
  }

  // Move the top edge while keeping the bottom edge in place
  if (mode.includes('top')) {
    const row = clamp(
      element.row + snappedRows,
      0,
      element.row + element.rowSpan - 1,
    );

    resized = {
      ...resized,
      row,
      rowSpan: element.row + element.rowSpan - row,
    };
  }

  // Grow or shrink from the bottom edge
  if (mode.includes('bottom')) {
    resized = {
      ...resized,
      rowSpan: clamp(element.rowSpan + snappedRows, 1, rows - element.row),
    };
  }

  return resized;
}

/**
 * Clamps a value between a minimum and maximum.
 *
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
