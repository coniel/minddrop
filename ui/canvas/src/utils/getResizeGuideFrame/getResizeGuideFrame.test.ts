import { describe, expect, it } from 'vitest';
import { CanvasNodeResizeEdge } from '../../types';
import { getResizeGuideFrame } from './getResizeGuideFrame';

// A node at (100, 50) sized 200x100
function resizeState(edge: CanvasNodeResizeEdge) {
  return {
    edge,
    startX: 0,
    startY: 0,
    originX: 100,
    originY: 50,
    originWidth: 200,
    originHeight: 100,
  };
}

describe('getResizeGuideFrame', () => {
  it('extends the frame to the dragged edge', () => {
    expect(getResizeGuideFrame(resizeState('right'), 40, 0, false)).toEqual({
      x: 100,
      y: 50,
      width: 240,
      height: 100,
    });
  });

  it('leaves the axis the resize does not move unchanged', () => {
    expect(getResizeGuideFrame(resizeState('bottom'), 40, 30, false)).toEqual({
      x: 100,
      y: 50,
      width: 200,
      height: 130,
    });
  });

  it('moves the opposite edge as well when mirrored', () => {
    expect(getResizeGuideFrame(resizeState('right'), 40, 0, true)).toEqual({
      x: 60,
      y: 50,
      width: 280,
      height: 100,
    });
  });

  it('moves both axes for corner resizes', () => {
    expect(
      getResizeGuideFrame(resizeState('top-left'), -40, -20, false),
    ).toEqual({
      x: 60,
      y: 30,
      width: 240,
      height: 120,
    });
  });

  it('orders the extents when the dragged edge passes the opposite one', () => {
    expect(getResizeGuideFrame(resizeState('right'), -250, 0, false)).toEqual({
      x: 50,
      y: 50,
      width: 50,
      height: 100,
    });
  });
});
