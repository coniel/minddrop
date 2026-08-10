import { describe, expect, it } from 'vitest';
import { CanvasConnectionAnchor } from '../../types';
import { connectionIntersectsFrame } from './connectionIntersectsFrame';

// Two anchors facing each other along the x axis
const left: CanvasConnectionAnchor = { point: { x: 0, y: 0 }, side: 'right' };
const right: CanvasConnectionAnchor = { point: { x: 200, y: 0 }, side: 'left' };

// Two anchors on downward facing sides, whose curve bulges below
// the line between them, peaking at (100, 75)
const bulgeStart: CanvasConnectionAnchor = {
  point: { x: 0, y: 0 },
  side: 'bottom',
};
const bulgeEnd: CanvasConnectionAnchor = {
  point: { x: 200, y: 0 },
  side: 'bottom',
};

describe('connectionIntersectsFrame', () => {
  it('returns false for a frame nowhere near the connection', () => {
    expect(
      connectionIntersectsFrame(left, right, 'direct', {
        x: 500,
        y: 500,
        width: 20,
        height: 20,
      }),
    ).toBe(false);
  });

  describe('direct', () => {
    it('returns true for a frame the segment crosses', () => {
      expect(
        connectionIntersectsFrame(left, right, 'direct', {
          x: 90,
          y: -10,
          width: 20,
          height: 20,
        }),
      ).toBe(true);
    });

    it('returns true for a frame containing an endpoint', () => {
      expect(
        connectionIntersectsFrame(left, right, 'direct', {
          x: -10,
          y: -10,
          width: 20,
          height: 20,
        }),
      ).toBe(true);
    });

    it('returns false for a frame beside the segment', () => {
      expect(
        connectionIntersectsFrame(left, right, 'direct', {
          x: 90,
          y: 50,
          width: 20,
          height: 20,
        }),
      ).toBe(false);
    });
  });

  describe('curved', () => {
    it('returns true for a frame crossing the middle of the curve', () => {
      expect(
        connectionIntersectsFrame(bulgeStart, bulgeEnd, 'curved', {
          x: 95,
          y: 70,
          width: 10,
          height: 10,
        }),
      ).toBe(true);
    });

    it('returns false for a frame on the chord the curve bulges away from', () => {
      expect(
        connectionIntersectsFrame(bulgeStart, bulgeEnd, 'curved', {
          x: 95,
          y: -10,
          width: 10,
          height: 10,
        }),
      ).toBe(false);
    });

    it('treats an unset shape as curved', () => {
      expect(
        connectionIntersectsFrame(bulgeStart, bulgeEnd, undefined, {
          x: 95,
          y: 70,
          width: 10,
          height: 10,
        }),
      ).toBe(true);
    });
  });

  describe('straight', () => {
    // The elbow route between these anchors runs right from
    // (0, 0), down the x = 100 line, then right to (200, 100)
    const elbowStart: CanvasConnectionAnchor = {
      point: { x: 0, y: 0 },
      side: 'right',
    };
    const elbowEnd: CanvasConnectionAnchor = {
      point: { x: 200, y: 100 },
      side: 'left',
    };

    it('returns true for a frame crossing the route between its corners', () => {
      expect(
        connectionIntersectsFrame(elbowStart, elbowEnd, 'straight', {
          x: 95,
          y: 45,
          width: 10,
          height: 10,
        }),
      ).toBe(true);
    });

    it('returns false for a frame within the route bounds but off it', () => {
      expect(
        connectionIntersectsFrame(elbowStart, elbowEnd, 'straight', {
          x: 150,
          y: 20,
          width: 10,
          height: 10,
        }),
      ).toBe(false);
    });
  });
});
