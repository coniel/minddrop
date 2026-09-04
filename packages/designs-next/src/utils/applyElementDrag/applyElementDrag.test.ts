import { describe, expect, it } from 'vitest';
import {
  cardColumns,
  cardRows,
  iconDesignElement,
  titleDesignElement,
} from '../../test-utils';
import { ApplyElementDragOptions, applyElementDrag } from './applyElementDrag';

// Grid context shared by the drag interactions under test
const baseOptions: Omit<ApplyElementDragOptions, 'mode'> = {
  deltaColumns: 0,
  deltaRows: 0,
  columns: cardColumns,
  rows: cardRows,
  snap: 2,
};

describe('applyElementDrag', () => {
  it('moves the element, snapping its edges onto the snap grid', () => {
    const moved = applyElementDrag(titleDesignElement, {
      ...baseOptions,
      mode: 'move',
      deltaColumns: 2.9,
      deltaRows: 1.2,
    });

    // Title at (2, 10) snaps its edges to the nearest multiples
    expect(moved.column).toBe(4);
    expect(moved.row).toBe(12);
  });

  it('heals off-grid placements onto the snap grid when moving', () => {
    const moved = applyElementDrag(
      { ...titleDesignElement, column: 3 },
      { ...baseOptions, mode: 'move', deltaColumns: 0.4 },
    );

    expect(moved.column).toBe(4);
  });

  it('clamps moves to the design bounds', () => {
    const moved = applyElementDrag(titleDesignElement, {
      ...baseOptions,
      mode: 'move',
      deltaColumns: 100,
      deltaRows: -100,
    });

    expect(moved.column).toBe(cardColumns - titleDesignElement.columnSpan);
    expect(moved.row).toBe(0);
  });

  it('resizes from the right edge, snapping the delta', () => {
    const resized = applyElementDrag(titleDesignElement, {
      ...baseOptions,
      mode: 'resize-right',
      deltaColumns: 2.8,
    });

    expect(resized.column).toBe(titleDesignElement.column);
    expect(resized.columnSpan).toBe(titleDesignElement.columnSpan + 2);
  });

  it('resizes from the left edge, keeping the right edge in place', () => {
    const resized = applyElementDrag(titleDesignElement, {
      ...baseOptions,
      mode: 'resize-left',
      deltaColumns: 4,
    });

    expect(resized.column).toBe(titleDesignElement.column + 4);
    expect(resized.columnSpan).toBe(titleDesignElement.columnSpan - 4);
  });

  it('resizes from the bottom edge, snapping the delta', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-bottom',
      deltaRows: 1.9,
    });

    expect(resized.row).toBe(iconDesignElement.row);
    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 2);
  });

  it('resizes from the top edge, keeping the bottom edge in place', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-top',
      deltaRows: -2,
    });

    expect(resized.row).toBe(iconDesignElement.row - 2);
    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 2);
  });

  it('resizes both edges from a corner, keeping the opposite corner in place', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-top-left',
      deltaColumns: -2,
      deltaRows: -2,
    });

    expect(resized.column).toBe(iconDesignElement.column - 2);
    expect(resized.columnSpan).toBe(iconDesignElement.columnSpan + 2);
    expect(resized.row).toBe(iconDesignElement.row - 2);
    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 2);
  });

  it('grows both spans from the bottom-right corner', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-bottom-right',
      deltaColumns: 2,
      deltaRows: 2,
    });

    expect(resized.column).toBe(iconDesignElement.column);
    expect(resized.row).toBe(iconDesignElement.row);
    expect(resized.columnSpan).toBe(iconDesignElement.columnSpan + 2);
    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 2);
  });

  it('keeps spans at least one unit', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-right',
      deltaColumns: -100,
    });

    expect(resized.columnSpan).toBe(1);
  });

  it('keeps spans at or above the minimum row span', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-bottom',
      deltaRows: -100,
      minRowSpan: 4,
    });

    expect(resized.rowSpan).toBe(4);
  });

  it('stops the top edge at the minimum row span', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-top',
      deltaRows: 100,
      minRowSpan: 4,
    });

    // The bottom edge stays put while the span floors at the minimum
    expect(resized.rowSpan).toBe(4);
    expect(resized.row + resized.rowSpan).toBe(
      iconDesignElement.row + iconDesignElement.rowSpan,
    );
  });

  it('steps vertical resizes by the row span step', () => {
    // A drag short of a whole step snaps to nothing
    const unchanged = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-bottom',
      deltaRows: 2,
      rowSpanStep: 6,
    });

    expect(unchanged.rowSpan).toBe(iconDesignElement.rowSpan);

    // A drag past half a step snaps to the whole step
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-bottom',
      deltaRows: 4,
      rowSpanStep: 6,
    });

    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 6);
  });

  it('steps top-edge resizes, keeping the bottom edge in place', () => {
    const resized = applyElementDrag(iconDesignElement, {
      ...baseOptions,
      mode: 'resize-top',
      deltaRows: -5,
      rowSpanStep: 6,
    });

    expect(resized.rowSpan).toBe(iconDesignElement.rowSpan + 6);
    expect(resized.row + resized.rowSpan).toBe(
      iconDesignElement.row + iconDesignElement.rowSpan,
    );
  });

  it('floors stepped spans truncated by the design bounds', () => {
    // Positioned so the bottom bound is not a whole step away
    const resized = applyElementDrag(
      { ...iconDesignElement, row: 9 },
      {
        ...baseOptions,
        mode: 'resize-bottom',
        deltaRows: 100,
        minRowSpan: 6,
        rowSpanStep: 6,
      },
    );

    // The bound allows 23 rows, flooring back onto 18
    expect(resized.rowSpan).toBe(18);
  });

  it('preserves extra element fields', () => {
    const moved = applyElementDrag(
      { ...titleDesignElement, label: 'Title' },
      { ...baseOptions, mode: 'move' },
    );

    expect(moved.label).toBe('Title');
  });
});
