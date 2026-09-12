import { describe, expect, it } from 'vitest';
import { UnitPixelSize } from '../../constants';
import {
  bodyDesignElement,
  cardRows,
  designElements,
  titleDesignElement,
} from '../../test-utils';
import { DesignElement } from '../../types';
import { resolveRowLayout } from './resolveRowLayout';

// The body's rows at unit height, which its measurements move from
const bodyUnitHeight = bodyDesignElement.rowSpan * UnitPixelSize;

describe('resolveRowLayout', () => {
  it('gives every row a unit height without fitted elements', () => {
    const layout = resolveRowLayout([titleDesignElement], cardRows, {});

    expect(layout.tops[1]).toBe(UnitPixelSize);
    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('stretches a growing element rows evenly to its measured height', () => {
    // Body spans rows 20-29, measured at 100px stretches each to 10px
    const layout = resolveRowLayout(designElements, cardRows, {
      [bodyDesignElement.id]: 100,
    });

    expect(layout.tops[21] - layout.tops[20]).toBe(10);
    expect(layout.totalHeight).toBe(
      cardRows * UnitPixelSize - bodyUnitHeight + 100,
    );
  });

  it('pushes rows below a stretched element down', () => {
    const layout = resolveRowLayout(designElements, cardRows, {
      [bodyDesignElement.id]: 100,
    });

    expect(layout.tops[30]).toBe(20 * UnitPixelSize + 100);
  });

  it('never shrinks a growing element rows below their unit height', () => {
    // Measured smaller than the element's block span
    const layout = resolveRowLayout(designElements, cardRows, {
      [bodyDesignElement.id]: 20,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('shrinks a shrinking element rows evenly to its measured height', () => {
    // Body spans rows 20-29, measured at 20px shrinks each to 2px
    const shrinking: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'shrink',
    };
    const layout = resolveRowLayout([shrinking], cardRows, {
      [shrinking.id]: 20,
    });

    expect(layout.tops[21] - layout.tops[20]).toBe(2);
    expect(layout.totalHeight).toBe(
      cardRows * UnitPixelSize - bodyUnitHeight + 20,
    );
  });

  it('pulls rows below a shrunk element up', () => {
    const shrinking: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'shrink',
    };
    const layout = resolveRowLayout([shrinking], cardRows, {
      [shrinking.id]: 20,
    });

    expect(layout.tops[30]).toBe(20 * UnitPixelSize + 20);
  });

  it('never stretches a shrinking element rows past their unit height', () => {
    // Measured larger than the element's block span
    const shrinking: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'shrink',
    };
    const layout = resolveRowLayout([shrinking], cardRows, {
      [shrinking.id]: 100,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('sizes a natural element rows to its measured height either way', () => {
    const natural: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'natural',
    };
    const shrunk = resolveRowLayout([natural], cardRows, {
      [natural.id]: 20,
    });
    const stretched = resolveRowLayout([natural], cardRows, {
      [natural.id]: 100,
    });

    expect(shrunk.totalHeight).toBe(
      cardRows * UnitPixelSize - bodyUnitHeight + 20,
    );
    expect(stretched.totalHeight).toBe(
      cardRows * UnitPixelSize - bodyUnitHeight + 100,
    );
  });

  it('collapses a natural element rows to empty content', () => {
    const natural: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'natural',
    };
    const layout = resolveRowLayout([natural], cardRows, {
      [natural.id]: 0,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize - bodyUnitHeight);
  });

  it('ignores unmeasured fitted elements', () => {
    const layout = resolveRowLayout(designElements, cardRows, {});

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('ignores measurements of fixed elements', () => {
    const layout = resolveRowLayout([titleDesignElement], cardRows, {
      [titleDesignElement.id]: 100,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('gives overlapping fitted elements rows their largest height', () => {
    // Two growing elements sharing rows, the taller one wins
    const otherElement: DesignElement = {
      ...bodyDesignElement,
      id: 'element_other',
    };
    const layout = resolveRowLayout(
      [bodyDesignElement, otherElement],
      cardRows,
      {
        [bodyDesignElement.id]: 100,
        [otherElement.id]: 200,
      },
    );

    expect(layout.tops[21] - layout.tops[20]).toBe(20);
    expect(layout.totalHeight).toBe(
      cardRows * UnitPixelSize - bodyUnitHeight + 200,
    );
  });

  it('holds rows a fixed element shares with a shrunk one at unit height', () => {
    // A fixed element over the shrinking body's rows keeps them whole
    const shrinking: DesignElement = {
      ...bodyDesignElement,
      contentFit: 'shrink',
    };
    const fixed: DesignElement = {
      ...titleDesignElement,
      row: shrinking.row,
      rowSpan: shrinking.rowSpan,
    };
    const layout = resolveRowLayout([shrinking, fixed], cardRows, {
      [shrinking.id]: 20,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });
});
