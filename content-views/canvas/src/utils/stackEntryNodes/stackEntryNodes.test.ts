import { describe, expect, it } from 'vitest';
import {
  DEFAULT_NODE_WIDTH,
  ESTIMATED_NODE_HEIGHT,
  NODE_GAP,
} from '../../constants';
import { stackEntryNodes } from './stackEntryNodes';

describe('stackEntryNodes', () => {
  it('places the entries one below the other from the point', () => {
    expect(
      stackEntryNodes([], ['entry-a', 'entry-b'], { x: 500, y: 200 }),
    ).toEqual([
      expect.objectContaining({
        id: 'entry-a',
        x: 500 - DEFAULT_NODE_WIDTH / 2,
        y: 200,
      }),
      expect.objectContaining({
        id: 'entry-b',
        x: 500 - DEFAULT_NODE_WIDTH / 2,
        y: 200 + ESTIMATED_NODE_HEIGHT + NODE_GAP,
      }),
    ]);
  });

  it('leaves the nodes as they are with no entries', () => {
    const nodes = [
      { type: 'entry' as const, id: 'entry-a', x: 0, y: 0, width: 400 },
    ];

    expect(stackEntryNodes(nodes, [], { x: 500, y: 200 })).toBe(nodes);
  });
});
