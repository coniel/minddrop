import { describe, expect, it } from 'vitest';
import {
  bodyDesignElement,
  coverDesignElement,
  designElements,
  iconDesignElement,
  titleDesignElement,
} from '../../test-utils';
import { resolveContextElements } from './resolveContextElements';

describe('resolveContextElements', () => {
  it('returns side-by-side neighbours', () => {
    expect(resolveContextElements(titleDesignElement, designElements)).toEqual([
      iconDesignElement,
    ]);
  });

  it('is symmetric between neighbours', () => {
    expect(resolveContextElements(iconDesignElement, designElements)).toEqual([
      titleDesignElement,
    ]);
  });

  it('excludes layered elements', () => {
    // The cover overlaps the title and icon on both axes
    expect(resolveContextElements(coverDesignElement, designElements)).toEqual(
      [],
    );
  });

  it('excludes elements in disjoint rows', () => {
    expect(resolveContextElements(bodyDesignElement, designElements)).toEqual(
      [],
    );
  });

  it('excludes the element itself', () => {
    expect(
      resolveContextElements(titleDesignElement, [titleDesignElement]),
    ).toEqual([]);
  });
});
