import { describe, expect, it } from 'vitest';
import { resolveSizeLabelFontSize } from './resolveSizeLabelFontSize';

describe('resolveSizeLabelFontSize', () => {
  it('fits the label to the box height', () => {
    expect(resolveSizeLabelFontSize('12 × 8', 400, 16)).toBe(8);
  });

  it('fits the label to the box width', () => {
    const fontSize = resolveSizeLabelFontSize('12 × 8', 40, 200);

    // The label spans the share of the width it may take
    expect(fontSize * '12 × 8'.length * 0.62).toBeCloseTo(40 * 0.8);
  });

  it('fits to the tighter of the two', () => {
    expect(resolveSizeLabelFontSize('12 × 8', 40, 8)).toBe(4);
  });

  it('leaves more room to a longer label', () => {
    expect(resolveSizeLabelFontSize('120 × 80', 40, 200)).toBeLessThan(
      resolveSizeLabelFontSize('12 × 8', 40, 200),
    );
  });
});
