import { describe, expect, it } from 'vitest';
import { iconDesignElement, titleDesignElement } from '../../test-utils';
import { DesignElement } from '../../types';
import { resolveScalingColumns } from './resolveScalingColumns';

// Fixed element pinned to the left edge with a free gap to its right
const fixedLeftElement: DesignElement = {
  ...iconDesignElement,
  widthMode: 'fixed-left',
  column: 0,
};

describe('resolveScalingColumns', () => {
  it('scales a fluid element across its own columns', () => {
    const scaling = resolveScalingColumns([titleDesignElement], 48);

    // Title columns 2-29 scale, the gaps on both sides stay fixed
    expect(scaling[1]).toBe(false);
    expect(scaling[2]).toBe(true);
    expect(scaling[29]).toBe(true);
    expect(scaling[30]).toBe(false);
  });

  it('keeps every gap fixed when a fluid element is present', () => {
    const scaling = resolveScalingColumns(
      [titleDesignElement, iconDesignElement],
      48,
    );

    // Only the fluid title's columns scale, the fixed icon's unpinned
    // side gap keeps its unit width.
    expect(scaling.filter(Boolean)).toHaveLength(titleDesignElement.columnSpan);
    expect(scaling[30]).toBe(false);
    expect(scaling[39]).toBe(false);
    expect(scaling[46]).toBe(false);
  });

  it('scales the right gap of a pinned-left element as a fallback', () => {
    const scaling = resolveScalingColumns([fixedLeftElement], 48);

    // The element's own columns stay fixed, the free gap to its right
    // absorbs the space.
    expect(scaling[0]).toBe(false);
    expect(scaling[5]).toBe(false);
    expect(scaling[6]).toBe(true);
    expect(scaling[47]).toBe(true);
  });

  it('scales the left gap of a pinned-right element as a fallback', () => {
    const scaling = resolveScalingColumns([iconDesignElement], 48);

    // The free gap to the element's left absorbs the space
    expect(scaling[0]).toBe(true);
    expect(scaling[39]).toBe(true);
    expect(scaling[40]).toBe(false);
    expect(scaling[46]).toBe(false);
  });

  it('scales both gaps of a centered element as a fallback', () => {
    const scaling = resolveScalingColumns(
      [{ ...iconDesignElement, widthMode: 'fixed-center', column: 20 }],
      48,
    );

    // The gaps on both sides absorb the space
    expect(scaling[19]).toBe(true);
    expect(scaling[20]).toBe(false);
    expect(scaling[25]).toBe(false);
    expect(scaling[26]).toBe(true);
  });

  it('keeps the gap between consecutive left-pinned elements fixed', () => {
    // A second left-pinned element two units right of the first
    const secondElement: DesignElement = {
      ...fixedLeftElement,
      id: 'element_second',
      column: 8,
    };
    const scaling = resolveScalingColumns(
      [fixedLeftElement, secondElement],
      48,
    );

    // The gap inside the chain stays fixed, the gap past it absorbs
    expect(scaling[6]).toBe(false);
    expect(scaling[7]).toBe(false);
    expect(scaling[14]).toBe(true);
    expect(scaling[47]).toBe(true);
  });

  it('keeps the gap between consecutive right-pinned elements fixed', () => {
    // A second right-pinned element two units left of the icon
    const secondElement: DesignElement = {
      ...iconDesignElement,
      id: 'element_second',
      column: 32,
    };
    const scaling = resolveScalingColumns(
      [secondElement, iconDesignElement],
      48,
    );

    // The gap inside the chain stays fixed, the gap before it absorbs
    expect(scaling[38]).toBe(false);
    expect(scaling[39]).toBe(false);
    expect(scaling[31]).toBe(true);
    expect(scaling[0]).toBe(true);
  });

  it('lets the gap absorb between differently pinned elements', () => {
    // A left-pinned element followed by a centered one
    const centeredElement: DesignElement = {
      ...iconDesignElement,
      widthMode: 'fixed-center',
      column: 20,
    };
    const scaling = resolveScalingColumns(
      [fixedLeftElement, centeredElement],
      48,
    );

    expect(scaling[6]).toBe(true);
    expect(scaling[19]).toBe(true);
  });

  it('stops absorbing at occupied columns', () => {
    const scaling = resolveScalingColumns(
      [fixedLeftElement, { ...iconDesignElement, widthMode: 'fixed-right' }],
      48,
    );

    // Both gaps stop where the other element's columns begin
    expect(scaling[6]).toBe(true);
    expect(scaling[39]).toBe(true);
    expect(scaling[40]).toBe(false);
    expect(scaling[0]).toBe(false);
  });
});
