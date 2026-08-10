import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import { CanvasViewConnection, CanvasViewData, CanvasViewNode } from '../types';
import { CanvasViewType } from './CanvasViewType';

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
  y: 100,
  width: 300,
};

const connection: CanvasViewConnection = {
  id: 'connection-1',
  from: { nodeId: 'entry-a', side: 'right' },
  to: { nodeId: 'entry-b', side: 'left' },
};

// A virtual canvas view loaded directly into the store, so
// updates skip file persistence
const canvasView: DataView<object, CanvasViewData> = {
  id: 'data-view_canvas-test',
  virtual: true,
  name: 'Canvas',
  type: 'canvas',
  icon: CanvasViewType.icon,
  dataSource: { type: 'collection', id: 'collection-1' },
  created: new Date('2026-01-01'),
  lastModified: new Date('2026-01-01'),
  data: { nodes: [nodeA, nodeB], connections: [connection] },
};

describe('CanvasViewType', () => {
  beforeEach(() => {
    // Register the type and load the test view into the store
    DataViewTypes.register(CanvasViewType);
    DataViews.Store.load([canvasView]);
  });

  afterEach(() => {
    // Reset the type registry and view store
    DataViewTypes.unregister(CanvasViewType.type);
    DataViews.Store.clear();
  });

  it('replaces the node list wholesale on update', async () => {
    // Persist a node list with a node removed. The update deep
    // merges, so this asserts that arrays replace rather than
    // merge, which node removal depends on.
    await DataViews.update(canvasView.id, { data: { nodes: [nodeA] } });

    expect(DataViews.get(canvasView.id).data).toEqual({
      nodes: [nodeA],
      connections: [connection],
    });
  });

  it('replaces the connection list wholesale on update', async () => {
    // Persist an empty connection list, asserting that removal
    // persists and the sibling nodes key is untouched
    await DataViews.update(canvasView.id, { data: { connections: [] } });

    expect(DataViews.get(canvasView.id).data).toEqual({
      nodes: [nodeA, nodeB],
      connections: [],
    });
  });

  it('indexes entry node IDs as references', async () => {
    const updated = await DataViews.update(canvasView.id, {
      data: { nodes: [nodeA], connections: [] },
    });

    expect(updated.references).toEqual(['entry-a']);
  });
});
