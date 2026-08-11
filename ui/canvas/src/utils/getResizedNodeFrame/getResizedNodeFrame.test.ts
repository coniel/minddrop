import { describe, expect, it } from 'vitest';
import { CanvasNodeResizeEdge } from '../../types';
import { getResizedNodeFrame } from './getResizedNodeFrame';

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

const options = {
  minWidth: 50,
  minHeight: 40,
  mirror: false,
  bounds: null,
};

describe('getResizedNodeFrame', () => {
  describe('right edge', () => {
    it('resizes the width', () => {
      expect(getResizedNodeFrame(resizeState('right'), 40, 0, options)).toEqual(
        {
          width: 240,
        },
      );
    });

    it('clamps to the minimum width', () => {
      expect(
        getResizedNodeFrame(resizeState('right'), -200, 0, options),
      ).toEqual({ width: 50 });
    });

    it('clamps to the workspace width when bounded', () => {
      expect(
        getResizedNodeFrame(resizeState('right'), 400, 0, {
          ...options,
          bounds: { width: 500, height: 500 },
        }),
      ).toEqual({ width: 400 });
    });

    it('grows from both sides when mirrored', () => {
      expect(
        getResizedNodeFrame(resizeState('right'), 40, 0, {
          ...options,
          mirror: true,
        }),
      ).toEqual({ width: 280, x: 60 });
    });

    it('caps the mirrored width at the node center when bounded', () => {
      expect(
        getResizedNodeFrame(resizeState('right'), 400, 0, {
          ...options,
          mirror: true,
          bounds: { width: 500, height: 500 },
        }),
      ).toEqual({ width: 400, x: 0 });
    });
  });

  describe('left edge', () => {
    it('moves the left edge, keeping the right one fixed', () => {
      expect(getResizedNodeFrame(resizeState('left'), -40, 0, options)).toEqual(
        {
          width: 240,
          x: 60,
        },
      );
    });

    it('stops at the workspace edge when bounded', () => {
      expect(
        getResizedNodeFrame(resizeState('left'), -200, 0, {
          ...options,
          bounds: { width: 500, height: 500 },
        }),
      ).toEqual({ width: 300, x: 0 });
    });

    it('grows from both sides when mirrored', () => {
      expect(
        getResizedNodeFrame(resizeState('left'), -40, 0, {
          ...options,
          mirror: true,
        }),
      ).toEqual({ width: 280, x: 60 });
    });
  });

  describe('bottom edge', () => {
    it('resizes the height', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom'), 0, 30, options),
      ).toEqual({ height: 130 });
    });

    it('clamps to the workspace height when bounded', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom'), 0, 30, {
          ...options,
          bounds: { width: 500, height: 120 },
        }),
      ).toEqual({ height: 70 });
    });

    it('grows from both sides when mirrored', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom'), 0, 30, {
          ...options,
          mirror: true,
        }),
      ).toEqual({ height: 160, y: 20 });
    });
  });

  describe('corners', () => {
    it('moves the top left corner', () => {
      expect(
        getResizedNodeFrame(resizeState('top-left'), -40, -20, options),
      ).toEqual({ width: 240, height: 120, x: 60, y: 30 });
    });

    it('moves the top right corner, leaving the position x fixed', () => {
      expect(
        getResizedNodeFrame(resizeState('top-right'), 40, -20, options),
      ).toEqual({ width: 240, height: 120, y: 30 });
    });

    it('moves the bottom left corner, leaving the position y fixed', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom-left'), -40, 30, options),
      ).toEqual({ width: 240, height: 130, x: 60 });
    });

    it('moves the bottom right corner, leaving the position fixed', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom-right'), 40, 30, options),
      ).toEqual({ width: 240, height: 130 });
    });

    it('resizes around the center when mirrored', () => {
      expect(
        getResizedNodeFrame(resizeState('bottom-right'), 40, 30, {
          ...options,
          mirror: true,
        }),
      ).toEqual({ width: 280, height: 160, x: 60, y: 20 });
    });

    it('clamps to the minimum size', () => {
      expect(
        getResizedNodeFrame(resizeState('top-left'), 400, 400, options),
      ).toEqual({ width: 50, height: 40, x: 250, y: 110 });
    });
  });
});
