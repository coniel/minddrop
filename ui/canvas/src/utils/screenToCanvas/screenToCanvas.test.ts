import { describe, expect, it } from 'vitest';
import { screenToCanvas } from './screenToCanvas';

describe('screenToCanvas', () => {
  it('returns the point unchanged at zoom 1 with no pan', () => {
    expect(screenToCanvas({ x: 100, y: 50 }, { x: 0, y: 0 }, 1)).toEqual({
      x: 100,
      y: 50,
    });
  });

  it('undoes the pan offset', () => {
    expect(screenToCanvas({ x: 100, y: 50 }, { x: 20, y: -10 }, 1)).toEqual({
      x: 80,
      y: 60,
    });
  });

  it('undoes the zoom scale after the pan', () => {
    expect(screenToCanvas({ x: 100, y: 50 }, { x: 20, y: 10 }, 2)).toEqual({
      x: 40,
      y: 20,
    });
  });
});
