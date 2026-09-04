import { describe, expect, it } from 'vitest';
import { designElements, iconDesignElement } from '../../test-utils';
import { DesignElement } from '../../types';
import { isElementPinOverridden } from './isElementPinOverridden';

describe('isElementPinOverridden', () => {
  it('returns true with a fluid element in the context', () => {
    // The fixed icon sits beside the fluid title
    expect(isElementPinOverridden(iconDesignElement, designElements)).toBe(
      true,
    );
  });

  it('returns false without context elements', () => {
    expect(isElementPinOverridden(iconDesignElement, [iconDesignElement])).toBe(
      false,
    );
  });

  it('returns false with only fixed context elements', () => {
    // A fixed element beside the fixed icon
    const fixedNeighbour: DesignElement = {
      ...iconDesignElement,
      id: 'element_neighbour',
      column: 0,
      widthMode: 'fixed-left',
    };

    expect(
      isElementPinOverridden(iconDesignElement, [
        fixedNeighbour,
        iconDesignElement,
      ]),
    ).toBe(false);
  });

  it('ignores layered fluid elements', () => {
    // A fluid element overlapping the icon on both axes
    const layered: DesignElement = {
      ...iconDesignElement,
      id: 'element_layered',
      widthMode: 'fluid',
    };

    expect(
      isElementPinOverridden(iconDesignElement, [layered, iconDesignElement]),
    ).toBe(false);
  });
});
