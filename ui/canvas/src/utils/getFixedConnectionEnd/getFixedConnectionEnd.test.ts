import { describe, expect, it } from 'vitest';
import { CanvasConnection } from '../../types';
import { getFixedConnectionEnd } from './getFixedConnectionEnd';

const nodes = {
  'node-1': { x: 0, y: 0, width: 100, height: 100 },
  'node-2': { x: 400, y: 0, width: 100, height: 100 },
};

const connection: CanvasConnection = {
  id: 'connection-1',
  from: { nodeId: 'node-1', side: 'right' },
  to: { nodeId: 'node-2', side: 'left' },
};

describe('getFixedConnectionEnd', () => {
  it('anchors the far end when grabbed near the source', () => {
    expect(getFixedConnectionEnd(connection, { x: 150, y: 50 }, nodes)).toEqual(
      {
        end: connection.to,
        point: { x: 400, y: 50 },
        looseEnd: 'from',
      },
    );
  });

  it('anchors the source end when grabbed near the target', () => {
    expect(getFixedConnectionEnd(connection, { x: 350, y: 50 }, nodes)).toEqual(
      {
        end: connection.from,
        point: { x: 100, y: 50 },
        looseEnd: 'to',
      },
    );
  });

  it('detaches the source end when grabbed at equal distance', () => {
    expect(
      getFixedConnectionEnd(connection, { x: 250, y: 50 }, nodes)?.looseEnd,
    ).toBe('from');
  });

  it('returns null when an endpoint node is not mounted', () => {
    const missing = {
      ...connection,
      to: { ...connection.to, nodeId: 'node-3' },
    };

    expect(getFixedConnectionEnd(missing, { x: 150, y: 50 }, nodes)).toBeNull();
  });
});
