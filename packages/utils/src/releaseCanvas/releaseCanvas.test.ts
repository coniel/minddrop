import { describe, expect, it } from 'vitest';
import { releaseCanvas } from './releaseCanvas';

describe('releaseCanvas', () => {
  it("zeroes the canvas's size", () => {
    const canvas = document.createElement('canvas');

    canvas.width = 800;
    canvas.height = 600;

    releaseCanvas(canvas);

    expect([canvas.width, canvas.height]).toEqual([0, 0]);
  });
});
