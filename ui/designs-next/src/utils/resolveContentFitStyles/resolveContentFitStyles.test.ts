import { describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { resolveContentFitStyles } from './resolveContentFitStyles';

const { bodyDesignElement, coverDesignElement } = DesignElementFixtures;

// The body's block height in pixels
const bodyBlockHeight =
  bodyDesignElement.rowSpan * Designs.constants.UnitPixelSize;

describe('resolveContentFitStyles', () => {
  it('sizes fixed elements from their block span', () => {
    expect(resolveContentFitStyles(coverDesignElement)).toEqual({
      height: coverDesignElement.rowSpan * Designs.constants.UnitPixelSize,
    });
  });

  it('gives growing elements their block span as a minimum height', () => {
    expect(resolveContentFitStyles(bodyDesignElement)).toEqual({
      minHeight: bodyBlockHeight,
    });
  });

  it('gives shrinking elements their block span as a maximum height', () => {
    expect(
      resolveContentFitStyles({ ...bodyDesignElement, contentFit: 'shrink' }),
    ).toEqual({ maxHeight: bodyBlockHeight });
  });

  it('leaves natural elements height to their content', () => {
    expect(
      resolveContentFitStyles({ ...bodyDesignElement, contentFit: 'natural' }),
    ).toEqual({});
  });
});
