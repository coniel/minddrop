import { describe, expect, it } from 'vitest';
import { createCanvasStore } from './createCanvasStore';

describe('createCanvasStore', () => {
  it('creates independent instances', () => {
    const storeA = createCanvasStore();
    const storeB = createCanvasStore();

    storeA.setZoom(2);

    expect(storeA.getZoom()).toBe(2);
    expect(storeB.getZoom()).toBe(1);
  });

  it('applies the initial transform config', () => {
    const store = createCanvasStore({
      initialZoom: 0.5,
      initialPan: { x: 10, y: 20 },
    });

    expect(store.getZoom()).toBe(0.5);
    expect(store.getPan()).toEqual({ x: 10, y: 20 });
  });

  describe('setZoom', () => {
    it('clamps zoom to the configured limits', () => {
      const store = createCanvasStore({ minZoom: 0.2, maxZoom: 2 });

      store.setZoom(5);
      expect(store.getZoom()).toBe(2);

      store.setZoom(0.01);
      expect(store.getZoom()).toBe(0.2);
    });

    it('keeps the focal point stationary', () => {
      const store = createCanvasStore();

      store.setPan(100, 50);
      store.setZoom(2, { x: 400, y: 300 });

      // The canvas point under the focal point before the zoom
      // ((400 - 100) / 1, (300 - 50) / 1) must map back to the
      // same viewport point after: 400 - 300 * 2 = -200
      expect(store.getPan()).toEqual({ x: -200, y: -200 });
    });
  });

  describe('zoomIn/zoomOut', () => {
    it('steps the zoom by 0.1', () => {
      const store = createCanvasStore();

      store.setZoom(1.5);
      store.zoomIn();

      expect(store.getZoom()).toBeCloseTo(1.6);

      store.zoomOut();
      store.zoomOut();

      expect(store.getZoom()).toBeCloseTo(1.4);
    });

    it('snaps to 100% when within the snap threshold', () => {
      const store = createCanvasStore();

      store.setZoom(0.95);
      store.zoomIn();

      expect(store.getZoom()).toBe(1);

      store.setZoom(1.05);
      store.zoomOut();

      expect(store.getZoom()).toBe(1);
    });

    it('zooms centered on the viewport', () => {
      const store = createCanvasStore();

      store.setViewportSize({ width: 1000, height: 800 });
      store.setZoom(2);
      store.zoomIn();

      // Focal zoom toward the viewport center adjusts the pan
      expect(store.getPan()).toEqual({
        x: 500 - 500 * (2.1 / 2),
        y: 400 - 400 * (2.1 / 2),
      });
    });
  });

  describe('resetView', () => {
    it('resets the transform', () => {
      const store = createCanvasStore();

      store.setZoom(2);
      store.setPan(100, 100);
      store.resetView();

      expect(store.getZoom()).toBe(1);
      expect(store.getPan()).toEqual({ x: 0, y: 0 });
    });
  });

  describe('fitToView', () => {
    it('fits registered nodes into the viewport', () => {
      const store = createCanvasStore();

      store.setViewportSize({ width: 1000, height: 800 });
      store.registerNode('node-1', {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
      store.fitToView();

      // A small frame fits at 100%, centered
      expect(store.getZoom()).toBe(1);
      expect(store.getPan()).toEqual({ x: 450, y: 350 });
    });

    it('resets the view when no nodes are registered', () => {
      const store = createCanvasStore();

      store.setViewportSize({ width: 1000, height: 800 });
      store.setZoom(2);
      store.fitToView();

      expect(store.getZoom()).toBe(1);
      expect(store.getPan()).toEqual({ x: 0, y: 0 });
    });
  });

  describe('centerOnNode', () => {
    it('centers the viewport on the node at 100% zoom', () => {
      const store = createCanvasStore();

      store.setViewportSize({ width: 1000, height: 800 });
      store.registerNode('node-1', {
        x: 200,
        y: 100,
        width: 100,
        height: 50,
      });
      store.setZoom(2);
      store.centerOnNode('node-1');

      expect(store.getZoom()).toBe(1);
      // Frame center (250, 125) lands on viewport center (500, 400)
      expect(store.getPan()).toEqual({ x: 250, y: 275 });
    });

    it('does nothing for unregistered nodes', () => {
      const store = createCanvasStore();

      store.setPan(10, 10);
      store.centerOnNode('missing');

      expect(store.getPan()).toEqual({ x: 10, y: 10 });
    });
  });

  describe('node registry', () => {
    it('registers, updates and unregisters nodes', () => {
      const store = createCanvasStore();
      const frame = { x: 0, y: 0, width: 100, height: 100 };

      store.registerNode('node-1', frame);
      expect(store.getNode('node-1')).toEqual(frame);

      store.updateNodeFrame('node-1', { x: 50 });
      expect(store.getNode('node-1')).toEqual({ ...frame, x: 50 });

      store.unregisterNode('node-1');
      expect(store.getNode('node-1')).toBeNull();
    });

    it('ignores frame updates for unregistered nodes', () => {
      const store = createCanvasStore();

      store.updateNodeFrame('missing', { x: 50 });

      expect(store.getNodes()).toEqual({});
    });
  });

  describe('connection drag', () => {
    it('starts a drag without a target', () => {
      const store = createCanvasStore();

      store.startConnectionDrag('node-1', 'right', { x: 100, y: 50 });

      expect(store.getConnectionDrag()).toEqual({
        fromNodeId: 'node-1',
        fromSide: 'right',
        point: { x: 100, y: 50 },
        targetNodeId: null,
        targetSide: null,
        reconnect: null,
      });
    });

    it('starts a drag re-routing an existing connection', () => {
      const store = createCanvasStore();

      store.startConnectionDrag(
        'node-1',
        'right',
        { x: 100, y: 50 },
        {
          connectionId: 'connection-1',
          end: 'to',
        },
      );

      expect(store.getConnectionDrag()?.reconnect).toEqual({
        connectionId: 'connection-1',
        end: 'to',
      });
    });

    it('updates the drag point and target', () => {
      const store = createCanvasStore();

      store.startConnectionDrag('node-1', 'right', { x: 100, y: 50 });
      store.updateConnectionDrag(
        { x: 300, y: 80 },
        { nodeId: 'node-2', side: 'left' },
      );

      expect(store.getConnectionDrag()).toEqual({
        fromNodeId: 'node-1',
        fromSide: 'right',
        point: { x: 300, y: 80 },
        targetNodeId: 'node-2',
        targetSide: 'left',
        reconnect: null,
      });
    });

    it('clears the target when updated without one', () => {
      const store = createCanvasStore();

      store.startConnectionDrag('node-1', 'right', { x: 100, y: 50 });
      store.updateConnectionDrag(
        { x: 300, y: 80 },
        { nodeId: 'node-2', side: 'left' },
      );
      store.updateConnectionDrag({ x: 320, y: 90 }, null);

      expect(store.getConnectionDrag()).toEqual({
        fromNodeId: 'node-1',
        fromSide: 'right',
        point: { x: 320, y: 90 },
        targetNodeId: null,
        targetSide: null,
        reconnect: null,
      });
    });

    it('ignores updates when no drag is in progress', () => {
      const store = createCanvasStore();

      store.updateConnectionDrag({ x: 300, y: 80 }, null);

      expect(store.getConnectionDrag()).toBeNull();
    });

    it('clears the drag', () => {
      const store = createCanvasStore();

      store.startConnectionDrag('node-1', 'right', { x: 100, y: 50 });
      store.clearConnectionDrag();

      expect(store.getConnectionDrag()).toBeNull();
    });
  });

  describe('setSnapToGrid/toggleSnapToGrid', () => {
    it('is off by default', () => {
      const store = createCanvasStore();

      expect(store.getSnapToGrid()).toBe(false);
    });

    it('applies the initial config', () => {
      const store = createCanvasStore({ initialSnapToGrid: true });

      expect(store.getSnapToGrid()).toBe(true);
    });

    it('sets and toggles snapping', () => {
      const store = createCanvasStore();

      store.setSnapToGrid(true);

      expect(store.getSnapToGrid()).toBe(true);

      store.toggleSnapToGrid();

      expect(store.getSnapToGrid()).toBe(false);
    });
  });

  describe('setSnapToObjects/toggleSnapToObjects', () => {
    it('is off by default', () => {
      const store = createCanvasStore();

      expect(store.getSnapToObjects()).toBe(false);
    });

    it('applies the initial config', () => {
      const store = createCanvasStore({ initialSnapToObjects: true });

      expect(store.getSnapToObjects()).toBe(true);
    });

    it('sets and toggles snapping', () => {
      const store = createCanvasStore();

      store.setSnapToObjects(true);

      expect(store.getSnapToObjects()).toBe(true);

      store.toggleSnapToObjects();

      expect(store.getSnapToObjects()).toBe(false);
    });
  });

  describe('selection', () => {
    it('has no selection by default', () => {
      const store = createCanvasStore();

      expect(store.getSelection()).toBeNull();
      expect(store.getSelectedNodeIds()).toEqual([]);
      expect(store.getSelectedConnectionIds()).toEqual([]);
    });

    it('selects nodes', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1', 'node-2']);

      expect(store.getSelection()).toEqual({
        type: 'nodes',
        ids: ['node-1', 'node-2'],
      });
      expect(store.isNodeSelected('node-1')).toBe(true);
      expect(store.isNodeSelected('node-3')).toBe(false);
    });

    it('replaces a connection selection with a node selection', () => {
      const store = createCanvasStore();

      store.selectConnections(['connection-1']);
      store.selectNodes(['node-1']);

      expect(store.getSelection()).toEqual({ type: 'nodes', ids: ['node-1'] });
      expect(store.getSelectedConnectionIds()).toEqual([]);
      expect(store.isConnectionSelected('connection-1')).toBe(false);
    });

    it('merges additive selections of the same type', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.selectNodes(['node-2'], true);

      expect(store.getSelectedNodeIds()).toEqual(['node-1', 'node-2']);
    });

    it('does not merge additive selections across types', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.selectConnections(['connection-1'], true);

      expect(store.getSelection()).toEqual({
        type: 'connections',
        ids: ['connection-1'],
      });
    });

    it('clears the selection when selecting nothing', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.selectNodes([]);

      expect(store.getSelection()).toBeNull();
    });

    it('skips updates that do not change the selection', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1', 'node-2']);

      const selection = store.getSelection();

      // An identical update keeps the same state object, avoiding
      // subscriber churn on every frame of a lasso drag
      store.selectNodes(['node-2', 'node-1']);

      expect(store.getSelection()).toBe(selection);
    });

    it('toggles a node into and out of the selection', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.toggleNodeSelection('node-2');

      expect(store.getSelectedNodeIds()).toEqual(['node-1', 'node-2']);

      store.toggleNodeSelection('node-1');

      expect(store.getSelectedNodeIds()).toEqual(['node-2']);
    });

    it('clears the selection when the last item is toggled off', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.toggleNodeSelection('node-1');

      expect(store.getSelection()).toBeNull();
    });

    it('replaces a node selection when toggling a connection', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.toggleConnectionSelection('connection-1');

      expect(store.getSelection()).toEqual({
        type: 'connections',
        ids: ['connection-1'],
      });
    });

    it('clears the selection', () => {
      const store = createCanvasStore();

      store.selectNodes(['node-1']);
      store.clearSelection();

      expect(store.getSelection()).toBeNull();
    });

    it('ignores selections when the canvas is not selectable', () => {
      const store = createCanvasStore({ selectable: false });

      store.selectNodes(['node-1']);
      store.toggleConnectionSelection('connection-1');

      expect(store.getSelectable()).toBe(false);
      expect(store.getSelection()).toBeNull();
    });
  });

  describe('setAlignmentGuides', () => {
    const guide = { axis: 'x' as const, position: 100, start: 0, end: 200 };

    it('has no guides by default', () => {
      const store = createCanvasStore();

      expect(store.getAlignmentGuides()).toEqual([]);
    });

    it('sets and clears the guides', () => {
      const store = createCanvasStore();

      store.setAlignmentGuides([guide]);

      expect(store.getAlignmentGuides()).toEqual([guide]);

      store.setAlignmentGuides([]);

      expect(store.getAlignmentGuides()).toEqual([]);
    });

    it('skips updates that leave the guides empty', () => {
      const store = createCanvasStore();
      const guides = store.getAlignmentGuides();

      store.setAlignmentGuides([]);

      // The state is untouched, so the array is the same instance
      expect(store.getAlignmentGuides()).toBe(guides);
    });
  });

  describe('setHoveredConnectionHandle', () => {
    it('sets and clears the hovered handle', () => {
      const store = createCanvasStore();

      store.setHoveredConnectionHandle({ nodeId: 'node-1', side: 'right' });

      expect(store.getHoveredConnectionHandle()).toEqual({
        nodeId: 'node-1',
        side: 'right',
      });

      store.setHoveredConnectionHandle(null);

      expect(store.getHoveredConnectionHandle()).toBeNull();
    });

    it('skips updates that do not change the handle', () => {
      const store = createCanvasStore();

      store.setHoveredConnectionHandle({ nodeId: 'node-1', side: 'right' });

      const handle = store.getHoveredConnectionHandle();

      // An identical update keeps the same state object, avoiding
      // subscriber churn on every cursor move
      store.setHoveredConnectionHandle({ nodeId: 'node-1', side: 'right' });

      expect(store.getHoveredConnectionHandle()).toBe(handle);
    });
  });
});
