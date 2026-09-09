import { describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '../../test-utils';
import { hasNeighbourOnSide } from './hasNeighbourOnSide';

const {
  bodyDesignElement,
  coverDesignElement,
  designElements,
  iconDesignElement,
} = DesignElementFixtures;

describe('hasNeighbourOnSide', () => {
  it('finds a side by side neighbour to the left', () => {
    // The title sits to the icon's left, sharing its rows
    expect(hasNeighbourOnSide(iconDesignElement, designElements, 'left')).toBe(
      true,
    );
  });

  it('reports no neighbour on a side the design edge is on', () => {
    // Nothing sits between the icon and the design's right edge
    expect(hasNeighbourOnSide(iconDesignElement, designElements, 'right')).toBe(
      false,
    );
  });

  it('finds a stacked neighbour above', () => {
    // The cover sits above the body, sharing its columns
    expect(hasNeighbourOnSide(bodyDesignElement, designElements, 'top')).toBe(
      true,
    );
    expect(
      hasNeighbourOnSide(bodyDesignElement, designElements, 'bottom'),
    ).toBe(false);
  });

  it('finds a stacked neighbour below', () => {
    expect(
      hasNeighbourOnSide(coverDesignElement, designElements, 'bottom'),
    ).toBe(true);
    expect(hasNeighbourOnSide(coverDesignElement, designElements, 'top')).toBe(
      false,
    );
  });

  it('ignores layered elements', () => {
    // The cover overlaps the icon on both axes, so neither is the
    // other's neighbour on any side.
    expect(
      hasNeighbourOnSide(
        iconDesignElement,
        [coverDesignElement, iconDesignElement],
        'left',
      ),
    ).toBe(false);
  });

  it('reports no neighbour for a lone element', () => {
    expect(
      hasNeighbourOnSide(iconDesignElement, [iconDesignElement], 'left'),
    ).toBe(false);
  });
});
