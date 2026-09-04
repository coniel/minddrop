import { describe, expect, it } from 'vitest';
import {
  bodyDesignElement,
  coverDesignElement,
  designElements,
  iconDesignElement,
  titleDesignElement,
} from '../../test-utils';
import { resolveVerticalContextElements } from './resolveVerticalContextElements';

describe('resolveVerticalContextElements', () => {
  it('returns stacked neighbours', () => {
    // The body sits below the cover, title and icon
    expect(
      resolveVerticalContextElements(bodyDesignElement, designElements),
    ).toEqual([coverDesignElement, titleDesignElement, iconDesignElement]);
  });

  it('excludes layered elements', () => {
    // The title overlaps the cover on both axes
    expect(
      resolveVerticalContextElements(titleDesignElement, [
        coverDesignElement,
        titleDesignElement,
      ]),
    ).toEqual([]);
  });

  it('excludes side-by-side elements', () => {
    // The title and icon share rows without sharing columns
    expect(
      resolveVerticalContextElements(titleDesignElement, [
        titleDesignElement,
        iconDesignElement,
      ]),
    ).toEqual([]);
  });

  it('excludes the element itself', () => {
    expect(
      resolveVerticalContextElements(bodyDesignElement, [bodyDesignElement]),
    ).toEqual([]);
  });
});
