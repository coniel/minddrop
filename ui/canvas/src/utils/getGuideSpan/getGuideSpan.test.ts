import { describe, expect, it } from 'vitest';
import { getGuideSpan } from './getGuideSpan';

const frame = { x: 100, y: 50, width: 200, height: 100 };

describe('getGuideSpan', () => {
  it('returns the vertical extent for the x axis', () => {
    expect(getGuideSpan(frame, 'x')).toEqual({ start: 50, end: 150 });
  });

  it('returns the horizontal extent for the y axis', () => {
    expect(getGuideSpan(frame, 'y')).toEqual({ start: 100, end: 300 });
  });
});
