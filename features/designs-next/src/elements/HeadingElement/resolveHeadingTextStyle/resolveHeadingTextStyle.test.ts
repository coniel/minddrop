import { describe, expect, it } from 'vitest';
import { FontLetterBand } from '@minddrop/ui-designs-next';
import { resolveHeadingTextStyle } from './resolveHeadingTextStyle';

// The band of a font whose letters take most of the font size, its
// accent room placing them low in the line box.
const band: FontLetterBand = { height: 0.94, lift: 0.11 };

// A six unit tall block
const blockHeight = 24;

describe('resolveHeadingTextStyle', () => {
  it('sizes the font so the letters fill the block', () => {
    const style = resolveHeadingTextStyle(blockHeight, band);

    expect(style.fontSize).toBe(blockHeight / band.height);
  });

  it('gives a line the block height', () => {
    const style = resolveHeadingTextStyle(blockHeight, band);

    expect(style.lineHeight).toBe(`${blockHeight}px`);
  });

  it('takes the block height, leaving the lift out of the layout', () => {
    const style = resolveHeadingTextStyle(blockHeight, band);

    // The height the text takes, its padded line box between its
    // margins.
    const occupied =
      Number(style.marginTop) +
      Number(style.paddingBlock) +
      blockHeight +
      Number(style.paddingBlock) +
      Number(style.marginBottom);

    expect(occupied).toBeCloseTo(blockHeight, 10);
  });

  it("takes the block's width, keeping room for leaning letters", () => {
    const style = resolveHeadingTextStyle(blockHeight, band);

    // The room to either side is held outside the block, so the
    // width the text takes is the block's own.
    expect(Number(style.paddingInline)).toBeGreaterThan(0);
    expect(Number(style.paddingInline) + Number(style.marginInline)).toBe(0);
  });

  it("sits the letters' band on the block's top edge", () => {
    const style = resolveHeadingTextStyle(blockHeight, band);

    // The band's top, the line box's top edge plus the distance the
    // band sits below it.
    const bandTop =
      Number(style.marginTop) +
      Number(style.paddingBlock) +
      Number(style.fontSize) * band.lift;

    expect(bandTop).toBeCloseTo(0, 10);
  });
});
