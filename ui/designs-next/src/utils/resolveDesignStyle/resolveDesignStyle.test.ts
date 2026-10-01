import { describe, expect, it } from 'vitest';
import { Design } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { resolveDesignStyle } from './resolveDesignStyle';

const { cardDesign_1, pageDesign_1 } = DesignFixtures;

// A page capped at the narrow width
const cappedDesign: Design = {
  ...pageDesign_1,
  columns: 120,
  contentWidth: 'narrow',
};

describe('resolveDesignStyle', () => {
  it("sets an aspect-locked design's ratio", () => {
    const style = resolveDesignStyle({ ...cardDesign_1, aspectRatio: '3/2' });

    expect(style.aspectRatio).toBe('3/2');
  });

  it('leaves an uncapped design to fill its container', () => {
    const style = resolveDesignStyle(pageDesign_1);

    expect(style.maxWidth).toBeUndefined();
    expect(style.paddingLeft).toBeUndefined();
  });

  it('caps a capped design at its width', () => {
    const style = resolveDesignStyle(cappedDesign);

    expect(style.maxWidth).toBe(480);
  });

  it('pads the sides, widening the cap by the padding', () => {
    const style = resolveDesignStyle({ ...cappedDesign, sidePadding: 24 });

    expect(style.paddingLeft).toBe(24);
    expect(style.paddingRight).toBe(24);
    expect(style.maxWidth).toBe(528);
  });

  it('pads the sides of an uncapped design', () => {
    const style = resolveDesignStyle({ ...pageDesign_1, sidePadding: 24 });

    expect(style.paddingLeft).toBe(24);
    expect(style.maxWidth).toBeUndefined();
  });
});
