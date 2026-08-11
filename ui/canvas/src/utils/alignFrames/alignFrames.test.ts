import { describe, expect, it } from 'vitest';
import { alignFrames } from './alignFrames';

// Bounds run 0,0 to 400,150
const frames = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 300, y: 50, width: 100, height: 100 },
};

describe('alignFrames', () => {
  it('returns nothing when given no frames', () => {
    expect(alignFrames({}, 'left')).toEqual({});
  });

  it('aligns to the left edge of the bounds', () => {
    expect(alignFrames(frames, 'left')).toEqual({
      'node-2': { x: 0, y: 50, width: 100, height: 100 },
    });
  });

  it('aligns to the right edge of the bounds', () => {
    expect(alignFrames(frames, 'right')).toEqual({
      'node-1': { x: 300, y: 0, width: 100, height: 100 },
    });
  });

  it('centers on the bounds', () => {
    expect(alignFrames(frames, 'center')).toEqual({
      'node-1': { x: 150, y: 0, width: 100, height: 100 },
      'node-2': { x: 150, y: 50, width: 100, height: 100 },
    });
  });

  it('aligns to the top edge of the bounds', () => {
    expect(alignFrames(frames, 'top')).toEqual({
      'node-2': { x: 300, y: 0, width: 100, height: 100 },
    });
  });

  it('aligns to the bottom edge of the bounds', () => {
    expect(alignFrames(frames, 'bottom')).toEqual({
      'node-1': { x: 0, y: 50, width: 100, height: 100 },
    });
  });

  it('centers on the middle of the bounds', () => {
    expect(alignFrames(frames, 'middle')).toEqual({
      'node-1': { x: 0, y: 25, width: 100, height: 100 },
      'node-2': { x: 300, y: 25, width: 100, height: 100 },
    });
  });

  it('omits frames the alignment does not move', () => {
    // Both already sit on the left edge
    expect(
      alignFrames(
        {
          'node-1': { x: 10, y: 0, width: 100, height: 100 },
          'node-2': { x: 10, y: 200, width: 100, height: 100 },
        },
        'left',
      ),
    ).toEqual({});
  });
});
