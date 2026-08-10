import { describe, expect, it } from 'vitest';
import { getElbowConnectionPoints } from './getElbowConnectionPoints';

describe('getElbowConnectionPoints', () => {
  it('joins aligned facing anchors with a straight line', () => {
    const points = getElbowConnectionPoints(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 0 }, side: 'left' },
    );

    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 200, y: 0 },
    ]);
  });

  it('steps between facing anchors at the halfway line', () => {
    const points = getElbowConnectionPoints(
      { point: { x: 0, y: 0 }, side: 'right' },
      { point: { x: 200, y: 100 }, side: 'left' },
    );

    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 200, y: 100 },
    ]);
  });

  it('steps between vertical facing anchors at the halfway line', () => {
    const points = getElbowConnectionPoints(
      { point: { x: 0, y: 0 }, side: 'bottom' },
      { point: { x: 200, y: 100 }, side: 'top' },
    );

    expect(points).toEqual([
      { x: 0, y: 0 },
      { x: 0, y: 50 },
      { x: 200, y: 50 },
      { x: 200, y: 100 },
    ]);
  });

  it('joins perpendicular anchors with a single corner', () => {
    // Bottom of one card to the left side of a card below right
    // of it: down, then right
    const points = getElbowConnectionPoints(
      { point: { x: 100, y: 100 }, side: 'bottom' },
      { point: { x: 300, y: 300 }, side: 'left' },
    );

    expect(points).toEqual([
      { x: 100, y: 100 },
      { x: 100, y: 300 },
      { x: 300, y: 300 },
    ]);
  });

  it('detours perpendicular anchors whose corner is invalid', () => {
    // Bottom of one card to the left side of a card below left of
    // it: down, left, down, right, splitting the parallel legs
    // evenly
    const points = getElbowConnectionPoints(
      { point: { x: 100, y: 100 }, side: 'bottom' },
      { point: { x: -200, y: 300 }, side: 'left' },
    );

    expect(points).toEqual([
      { x: 100, y: 100 },
      { x: 100, y: 200 },
      { x: -224, y: 200 },
      { x: -224, y: 300 },
      { x: -200, y: 300 },
    ]);
  });

  it('crosses perpendicular detours in the gap before the target frame', () => {
    // The target card is tall, placing its left anchor far below
    // its top edge: the crossing happens in the middle of the gap
    // above the card rather than halfway to the anchor
    const points = getElbowConnectionPoints(
      { point: { x: 100, y: 100 }, side: 'bottom' },
      {
        point: { x: -200, y: 400 },
        side: 'left',
        frame: { x: -200, y: 200, width: 300, height: 400 },
      },
    );

    expect(points).toEqual([
      { x: 100, y: 100 },
      { x: 100, y: 150 },
      { x: -224, y: 150 },
      { x: -224, y: 400 },
      { x: -200, y: 400 },
    ]);
  });

  it('routes perpendicular detours around the target when there is no gap', () => {
    // The target card's top sits above the exit anchor, leaving
    // no space to cross before it: the route passes its far side
    const points = getElbowConnectionPoints(
      { point: { x: 100, y: 100 }, side: 'bottom' },
      {
        point: { x: -300, y: 150 },
        side: 'left',
        frame: { x: -300, y: 50, width: 200, height: 200 },
      },
    );

    expect(points).toEqual([
      { x: 100, y: 100 },
      { x: 100, y: 274 },
      { x: -324, y: 274 },
      { x: -324, y: 150 },
      { x: -300, y: 150 },
    ]);
  });

  it('loops facing anchors around through the gap between frames', () => {
    // The target's left side faces away from the source, with a
    // clear horizontal channel between the two frames
    const points = getElbowConnectionPoints(
      {
        point: { x: 600, y: 50 },
        side: 'right',
        frame: { x: 400, y: 0, width: 200, height: 100 },
      },
      {
        point: { x: 0, y: 350 },
        side: 'left',
        frame: { x: 0, y: 300, width: 200, height: 100 },
      },
    );

    expect(points).toEqual([
      { x: 600, y: 50 },
      { x: 624, y: 50 },
      { x: 624, y: 200 },
      { x: -24, y: 200 },
      { x: -24, y: 350 },
      { x: 0, y: 350 },
    ]);
  });

  it('loops same-facing anchors around the outermost side', () => {
    const points = getElbowConnectionPoints(
      {
        point: { x: 200, y: 50 },
        side: 'right',
        frame: { x: 0, y: 0, width: 200, height: 100 },
      },
      {
        point: { x: 600, y: 250 },
        side: 'right',
        frame: { x: 400, y: 200, width: 200, height: 100 },
      },
    );

    expect(points).toEqual([
      { x: 200, y: 50 },
      { x: 624, y: 50 },
      { x: 624, y: 250 },
      { x: 600, y: 250 },
    ]);
  });

  it('detours same-facing loops that would cross a frame', () => {
    // The loop from the source's right side toward the target's
    // right side would pass through the target card, so the route
    // goes around the outside instead
    const points = getElbowConnectionPoints(
      {
        point: { x: 200, y: 50 },
        side: 'right',
        frame: { x: 0, y: 0, width: 200, height: 100 },
      },
      {
        point: { x: 600, y: 50 },
        side: 'right',
        frame: { x: 400, y: 0, width: 200, height: 100 },
      },
    );

    expect(points).toEqual([
      { x: 200, y: 50 },
      { x: 224, y: 50 },
      { x: 224, y: -24 },
      { x: 624, y: -24 },
      { x: 624, y: 50 },
      { x: 600, y: 50 },
    ]);
  });
});
