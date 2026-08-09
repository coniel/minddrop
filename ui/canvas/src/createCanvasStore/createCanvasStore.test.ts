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
});
