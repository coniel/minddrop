import { describe, expect, it } from 'vitest';
import { CanvasConnection } from '../../types';
import { getConnectionAnchors } from './getConnectionAnchors';

const nodes = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 200, y: 0, width: 100, height: 100 },
};

const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

describe('getConnectionAnchors', () => {
  it('anchors each end to its side, with the node frame', () => {
    expect(getConnectionAnchors(connection, nodes)).toEqual({
      from: {
        point: { x: 100, y: 50 },
        side: 'right',
        frame: nodes['node-1'],
      },
      to: {
        point: { x: 200, y: 50 },
        side: 'left',
        frame: nodes['node-2'],
      },
    });
  });

  it('anchors to the offset along the side when set', () => {
    const offset = {
      ...connection,
      from: { ...connection.from, offset: 25 },
    };

    expect(getConnectionAnchors(offset, nodes)?.from.point).toEqual({
      x: 100,
      y: 25,
    });
  });

  it('returns null when an endpoint node is not mounted', () => {
    const missing = {
      ...connection,
      to: { ...connection.to, nodeId: 'node-3' },
    };

    expect(getConnectionAnchors(missing, nodes)).toBeNull();
  });
});
