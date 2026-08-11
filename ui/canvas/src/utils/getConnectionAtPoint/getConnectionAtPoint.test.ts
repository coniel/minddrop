import { describe, expect, it } from 'vitest';
import { CanvasConnection, CanvasNodeFrame } from '../../types';
import { getConnectionAtPoint } from './getConnectionAtPoint';

// Two nodes side by side with a horizontal gap between them
const nodes: Record<string, CanvasNodeFrame> = {
  'node-1': { x: 0, y: 0, width: 200, height: 100 },
  'node-2': { x: 400, y: 0, width: 200, height: 100 },
  'node-3': { x: 400, y: 300, width: 200, height: 100 },
};

// A direct edge from node-1's right side to node-2's left side,
// running horizontally along y 50
const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
  shape: 'direct',
};

describe('getConnectionAtPoint', () => {
  it('returns the connection within threshold of the point', () => {
    expect(
      getConnectionAtPoint([connection], nodes, { x: 300, y: 58 }, 12),
    ).toEqual(connection);
  });

  it('returns null when no path is within threshold', () => {
    expect(
      getConnectionAtPoint([connection], nodes, { x: 300, y: 120 }, 12),
    ).toBeNull();
  });

  it('returns the closest of multiple nearby connections', () => {
    // A second direct edge into node-3, dipping below the first
    const lower: CanvasConnection = {
      id: 'connection-2',
      from: { nodeId: 'node-1', side: 'right' },
      to: { nodeId: 'node-3', side: 'left' },
      shape: 'direct',
    };

    // A point on the lower edge's diagonal, below the first edge
    const found = getConnectionAtPoint(
      [connection, lower],
      nodes,
      { x: 300, y: 200 },
      12,
    );

    expect(found).toEqual(lower);
  });

  it('anchors paths at connection end offsets', () => {
    // The same edge anchored near the nodes' top corners
    const offsetConnection: CanvasConnection = {
      ...connection,
      from: { ...connection.from, offset: 10 },
      to: { ...connection.to, offset: 10 },
    };

    // On the offset path, far from the midpoint path
    expect(
      getConnectionAtPoint([offsetConnection], nodes, { x: 300, y: 10 }, 12),
    ).toEqual(offsetConnection);

    // On the midpoint path, which the offset path no longer runs
    // along
    expect(
      getConnectionAtPoint([offsetConnection], nodes, { x: 300, y: 50 }, 12),
    ).toBeNull();
  });

  it('skips connections whose endpoint nodes are missing', () => {
    const dangling: CanvasConnection = {
      ...connection,
      id: 'connection-3',
      to: { nodeId: 'missing', side: 'left' },
    };

    expect(
      getConnectionAtPoint([dangling], nodes, { x: 300, y: 50 }, 12),
    ).toBeNull();
  });
});
