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

  /**
   * The element's minimum row span in grid units, acting as its
   * vertical resize floor. Defaults to one unit.
   */
  minRowSpan?: number;

  /**
   * The element's vertical resize step in grid units. When given,
   * vertical resize deltas snap to it instead of the snap
   * resolution, keeping the span on whole steps.
   */
  rowSpanStep?: number;
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
  const {
    mode,
    deltaColumns,
    deltaRows,
    columns,
    rows,
    snap,
    minRowSpan = 1,
    rowSpanStep,
  } = options;

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

  // Snap the drag delta so the untouched edges stay put. Vertical
  // deltas snap to the row span step when the element has one.
  const snappedColumns = snapToMultiple(deltaColumns, snap);
  const snappedRows = snapToMultiple(deltaRows, rowSpanStep ?? snap);

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
    const bottomEdge = element.row + element.rowSpan;
    const rowSpan = clampRowSpan(
      element.rowSpan - snappedRows,
      minRowSpan,
      bottomEdge,
      rowSpanStep,
    );

    resized = { ...resized, row: bottomEdge - rowSpan, rowSpan };
  }

  // Grow or shrink from the bottom edge
  if (mode.includes('bottom')) {
    resized = {
      ...resized,
      rowSpan: clampRowSpan(
        element.rowSpan + snappedRows,
        minRowSpan,
        rows - element.row,
        rowSpanStep,
      ),
    };
  }

  return resized;
}

/**
 * Clamps a row span to its bounds, flooring it back onto whole steps
 * when a bound truncates a stepped span.
 *
 * @param rowSpan - The candidate row span.
 * @param min - The minimum row span.
 * @param max - The maximum row span.
 * @param step - The row span step, when the element has one.
 * @returns The clamped row span.
 */
function clampRowSpan(
  rowSpan: number,
  min: number,
  max: number,
  step?: number,
): number {
  // Clamp the span to its bounds
  const clamped = clamp(rowSpan, min, max);

  // Without a step the clamped span is final
  if (!step) {
    return clamped;
  }

  // Floor the span back onto a whole step, keeping the minimum
  return Math.max(Math.floor(clamped / step) * step, min);
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
