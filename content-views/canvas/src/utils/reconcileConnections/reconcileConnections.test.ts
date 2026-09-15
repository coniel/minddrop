import { describe, expect, it } from 'vitest';
import { CanvasViewConnection, CanvasViewNode } from '../../types';
import { reconcileConnections } from './reconcileConnections';

const nodes: CanvasViewNode[] = [
  { type: 'entry', id: 'entry-a', x: 0, y: 0, width: 300 },
  { type: 'entry', id: 'entry-b', x: 400, y: 0, width: 300 },
];

const connection: CanvasViewConnection = {
  id: 'connection-1',
  from: { nodeId: 'entry-a', side: 'right' },
  to: { nodeId: 'entry-b', side: 'left' },
};

describe('reconcileConnections', () => {
  it('keeps connections between nodes on the canvas', () => {
    expect(reconcileConnections([connection], nodes)).toEqual([connection]);
  });

  it('drops connections attached to removed nodes', () => {
    const connections: CanvasViewConnection[] = [
      connection,
      {
        id: 'connection-2',
        from: { nodeId: 'entry-a', side: 'bottom' },
        to: { nodeId: 'removed', side: 'top' },
      },
      {
        id: 'connection-3',
        from: { nodeId: 'removed', side: 'right' },
        to: { nodeId: 'entry-b', side: 'top' },
      },
    ];

    expect(reconcileConnections(connections, nodes)).toEqual([connection]);
  });
});
