import { describe, expect, it } from 'vitest';
import { CanvasNodeResizeEdge } from '../../types';
import { getResizeAnchors } from './getResizeAnchors';

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

describe('getResizeAnchors', () => {
  it('anchors to the left edge when dragged from the left', () => {
    expect(getResizeAnchors(resizeState('left')).x).toBe(100);
  });

  it('anchors to the right edge when not dragged from the left', () => {
    expect(getResizeAnchors(resizeState('right')).x).toBe(300);
    expect(getResizeAnchors(resizeState('bottom')).x).toBe(300);
  });

  it('anchors to the top edge when dragged from the top', () => {
    expect(getResizeAnchors(resizeState('top-right')).y).toBe(50);
  });

  it('anchors to the bottom edge when not dragged from the top', () => {
    expect(getResizeAnchors(resizeState('bottom-left')).y).toBe(150);
    expect(getResizeAnchors(resizeState('left')).y).toBe(150);
  });
});
