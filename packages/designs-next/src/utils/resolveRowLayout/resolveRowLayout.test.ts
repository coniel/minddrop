import { describe, expect, it } from 'vitest';
import { UnitPixelSize } from '../../constants';
import {
  blockElements,
  bodyElement,
  cardRows,
  titleElement,
} from '../../test-utils';
import { resolveRowLayout } from './resolveRowLayout';

describe('resolveRowLayout', () => {
  it('gives every row a unit height without natural elements', () => {
    const layout = resolveRowLayout([titleElement], cardRows, {});

    expect(layout.tops[1]).toBe(UnitPixelSize);
    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('stretches a natural element rows evenly to its measured height', () => {
    // Body spans rows 20-29, measured at 100px stretches each to 10px
    const layout = resolveRowLayout(blockElements, cardRows, {
      [bodyElement.id]: 100,
    });

    expect(layout.tops[21] - layout.tops[20]).toBe(10);
    expect(layout.totalHeight).toBe((cardRows - 10) * UnitPixelSize + 100);
  });

  it('pushes rows below a stretched element down', () => {
    const layout = resolveRowLayout(blockElements, cardRows, {
      [bodyElement.id]: 100,
    });

    expect(layout.tops[30]).toBe(20 * UnitPixelSize + 100);
  });

  it('never shrinks rows below their unit height', () => {
    // Measured smaller than the element's block span
    const layout = resolveRowLayout(blockElements, cardRows, {
      [bodyElement.id]: 20,
    });

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('ignores unmeasured natural elements', () => {
    const layout = resolveRowLayout(blockElements, cardRows, {});

    expect(layout.totalHeight).toBe(cardRows * UnitPixelSize);
  });

  it('gives overlapping natural elements rows their largest height', () => {
    // Two natural elements sharing rows, the taller one wins
    const otherElement = { ...bodyElement, id: 'element-other' };
    const layout = resolveRowLayout([bodyElement, otherElement], cardRows, {
      [bodyElement.id]: 100,
      [otherElement.id]: 200,
    });

    expect(layout.tops[21] - layout.tops[20]).toBe(20);
    expect(layout.totalHeight).toBe((cardRows - 10) * UnitPixelSize + 200);
  });
});
