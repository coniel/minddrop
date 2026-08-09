import { describe, expect, it } from 'vitest';
import { screenToCanvas } from '../screenToCanvas';
import { canvasToScreen } from './canvasToScreen';

describe('canvasToScreen', () => {
  it('returns the point unchanged at zoom 1 with no pan', () => {
    expect(canvasToScreen({ x: 100, y: 50 }, { x: 0, y: 0 }, 1)).toEqual({
      x: 100,
      y: 50,
    });
  });

  it('applies the zoom scale before the pan', () => {
    expect(canvasToScreen({ x: 40, y: 20 }, { x: 20, y: 10 }, 2)).toEqual({
      x: 100,
      y: 50,
    });
  });

  it('round-trips with screenToCanvas', () => {
    const pan = { x: -35, y: 120 };
    const zoom = 0.75;
    const point = { x: 312, y: -87 };

    expect(canvasToScreen(screenToCanvas(point, pan, zoom), pan, zoom)).toEqual(
      point,
    );
  });
});
