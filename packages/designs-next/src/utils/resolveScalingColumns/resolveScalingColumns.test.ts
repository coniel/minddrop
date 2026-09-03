import { describe, expect, it } from 'vitest';
import { iconElement, titleElement } from '../../test-utils';
import { BlockElement } from '../../types';
import { resolveScalingColumns } from './resolveScalingColumns';

// Fixed element pinned to the left edge with a free gap to its right
const fixedLeftElement: BlockElement = {
  ...iconElement,
  widthMode: 'fixed-left',
  column: 0,
};

describe('resolveScalingColumns', () => {
  it('scales a fluid element across its own columns', () => {
    const scaling = resolveScalingColumns([titleElement], 48);

    // Title columns 2-29 scale, the gaps on both sides stay fixed
    expect(scaling[1]).toBe(false);
    expect(scaling[2]).toBe(true);
    expect(scaling[29]).toBe(true);
    expect(scaling[30]).toBe(false);
  });

  it('keeps every gap fixed when a fluid element is present', () => {
    const scaling = resolveScalingColumns([titleElement, iconElement], 48);

    // Only the fluid title's columns scale, the fixed icon's unpinned
    // side gap keeps its unit width
    expect(scaling.filter(Boolean)).toHaveLength(titleElement.columnSpan);
    expect(scaling[30]).toBe(false);
    expect(scaling[39]).toBe(false);
    expect(scaling[46]).toBe(false);
  });

  it('scales the right gap of a pinned-left element as a fallback', () => {
    const scaling = resolveScalingColumns([fixedLeftElement], 48);

    // The element's own columns stay fixed, the free gap to its right
    // absorbs the space
    expect(scaling[0]).toBe(false);
    expect(scaling[5]).toBe(false);
    expect(scaling[6]).toBe(true);
    expect(scaling[47]).toBe(true);
  });

  it('scales the left gap of a pinned-right element as a fallback', () => {
    const scaling = resolveScalingColumns([iconElement], 48);

    // The free gap to the element's left absorbs the space
    expect(scaling[0]).toBe(true);
    expect(scaling[39]).toBe(true);
    expect(scaling[40]).toBe(false);
    expect(scaling[46]).toBe(false);
  });

  it('scales both gaps of a centered element as a fallback', () => {
    const scaling = resolveScalingColumns(
      [{ ...iconElement, widthMode: 'fixed-center', column: 20 }],
      48,
    );

    // The gaps on both sides absorb the space
    expect(scaling[19]).toBe(true);
    expect(scaling[20]).toBe(false);
    expect(scaling[25]).toBe(false);
    expect(scaling[26]).toBe(true);
  });

  it('stops absorbing at occupied columns', () => {
    const scaling = resolveScalingColumns(
      [fixedLeftElement, { ...iconElement, widthMode: 'fixed-right' }],
      48,
    );

    // Both gaps stop where the other element's columns begin
    expect(scaling[6]).toBe(true);
    expect(scaling[39]).toBe(true);
    expect(scaling[40]).toBe(false);
    expect(scaling[0]).toBe(false);
  });
});
