import { describe, expect, it } from 'vitest';
import { CanvasViewConnection, CanvasViewNode } from '../../types';
import { mapDataReferences } from './mapDataReferences';

const nodeA: CanvasViewNode = {
  type: 'entry',
  id: 'entry-a',
  x: 0,
  y: 0,
  width: 300,
};

const nodeB: CanvasViewNode = {
  type: 'entry',
  id: 'entry-b',
  x: 400,
  y: 0,
  width: 300,
};

const connection: CanvasViewConnection = {
  id: 'connection-1',
  from: { nodeId: 'entry-a', side: 'right' },
  to: { nodeId: 'entry-b', side: 'left' },
};

describe('mapDataReferences', () => {
  it('passes through configs without data', () => {
    const config = { options: {} };

    expect(mapDataReferences(config, () => 'converted')).toBe(config);
  });

  it('converts entry node IDs', () => {
    const config = { data: { nodes: [nodeA], connections: [] } };

    const result = mapDataReferences(config, (value) => `ref:${value}`);

    expect(result.data?.nodes).toEqual([{ ...nodeA, id: 'ref:entry-a' }]);
  });

  it('drops nodes with unconvertible IDs', () => {
    const config = { data: { nodes: [nodeA, nodeB], connections: [] } };

    const result = mapDataReferences(config, (value) =>
      value === 'entry-a' ? value : null,
    );

    expect(result.data?.nodes).toEqual([nodeA]);
  });

  it('converts connection endpoint node IDs', () => {
    const config = {
      data: { nodes: [nodeA, nodeB], connections: [connection] },
    };

    const result = mapDataReferences(config, (value) => `ref:${value}`);

    expect(result.data?.connections).toEqual([
      {
        ...connection,
        from: { nodeId: 'ref:entry-a', side: 'right' },
        to: { nodeId: 'ref:entry-b', side: 'left' },
      },
    ]);
  });

  it('drops connections attached to unconvertible nodes', () => {
    const config = {
      data: { nodes: [nodeA, nodeB], connections: [connection] },
    };

    const result = mapDataReferences(config, (value) =>
      value === 'entry-a' ? value : null,
    );

    expect(result.data?.connections).toEqual([]);
  });

  it('drops connections attached to nodes not on the canvas', () => {
    const config = {
      data: {
        nodes: [nodeA, nodeB],
        connections: [
          connection,
          {
            id: 'connection-2',
            from: { nodeId: 'entry-a', side: 'bottom' as const },
            to: { nodeId: 'missing', side: 'top' as const },
          },
        ],
      },
    };

    const result = mapDataReferences(config, (value) => value);

    expect(result.data?.connections).toEqual([connection]);
  });

  it('preserves options', () => {
    const config = {
      options: { cardLayoutOverrides: { db: 'layout' } },
      data: { nodes: [nodeA], connections: [] },
    };

    const result = mapDataReferences(config, (value) => value);

    expect(result.options).toEqual(config.options);
  });
});
