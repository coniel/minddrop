import { describe, expect, it } from 'vitest';
import { bodyDesignElement, coverDesignElement } from '../../test-utils';
import { DesignElement } from '../../types';
import { isElementVerticalPinOverridden } from './isElementVerticalPinOverridden';

// A bottom-pinned body below the cover
const pinnedBody: DesignElement = {
  ...bodyDesignElement,
  heightMode: 'fixed-bottom',
};

describe('isElementVerticalPinOverridden', () => {
  it('returns true with a fluid-height element in the vertical context', () => {
    // The cover above the body has no height mode, meaning fluid
    expect(
      isElementVerticalPinOverridden(pinnedBody, [
        coverDesignElement,
        pinnedBody,
      ]),
    ).toBe(true);
  });

  it('returns false with only fixed-height context elements', () => {
    const pinnedCover: DesignElement = {
      ...coverDesignElement,
      heightMode: 'fixed-top',
    };

    expect(
      isElementVerticalPinOverridden(pinnedBody, [pinnedCover, pinnedBody]),
    ).toBe(false);
  });

  it('returns false without context elements', () => {
    expect(isElementVerticalPinOverridden(pinnedBody, [pinnedBody])).toBe(
      false,
    );
  });
});
