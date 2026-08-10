import { createStore } from '@minddrop/stores';
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  FIT_PADDING,
  ZOOM_SNAP_THRESHOLD,
  ZOOM_STEP,
} from '../constants';
import {
  CanvasConnectionDrag,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasNodeFrame,
  CanvasNodeSide,
  CanvasPoint,
  CanvasState,
  CanvasStoreConfig,
  CanvasViewportSize,
} from '../types';
import { computeFitTransform } from '../utils';

/**
 * The internal Zustand store backing a canvas instance.
 */
export type CanvasUseStore = ReturnType<typeof createInternalStore>;

export interface CanvasStore {
  /**
   * The internal Zustand store, for selector subscriptions.
   */
  useStore: CanvasUseStore;

  /**
   * Returns the current zoom level (1 = 100%).
   */
  getZoom(): number;

  /**
   * Returns the current pan offset in pixels.
   */
  getPan(): CanvasPoint;

  /**
   * Returns the minimum zoom level.
   */
  getMinZoom(): number;

  /**
   * Returns the maximum zoom level.
   */
  getMaxZoom(): number;

  /**
   * Returns the size of the viewport element. Zero until the
   * viewport has mounted.
   */
  getViewportSize(): CanvasViewportSize;

  /**
   * Returns a registered node's frame.
   *
   * @param nodeId - The ID of the node to get.
   */
  getNode(nodeId: string): CanvasNodeFrame | null;

  /**
   * Returns all registered node frames keyed by node ID.
   */
  getNodes(): Record<string, CanvasNodeFrame>;

  /**
   * Returns whether node drags and resizes snap to the grid.
   */
  getSnapToGrid(): boolean;

  /**
   * Returns the in-progress connection drag, or null when no
   * connection is being dragged.
   */
  getConnectionDrag(): CanvasConnectionDrag | null;

  /**
   * Returns the node side whose connection handle the cursor is
   * near, or null when none is near.
   */
  getHoveredConnectionHandle(): CanvasConnectionEnd | null;

  /**
   * Sets the zoom level, optionally zooming toward a focal point.
   *
   * @param zoom - The new zoom level (clamped to minZoom–maxZoom).
   * @param focalPoint - The point in viewport coordinates to zoom toward.
   */
  setZoom(zoom: number, focalPoint?: CanvasPoint): void;

  /**
   * Sets the pan offset.
   *
   * @param x - The horizontal offset.
   * @param y - The vertical offset.
   */
  setPan(x: number, y: number): void;

  /**
   * Zooms in by one step, centered on the viewport.
   * Snaps to 100% if the result is within the snap threshold.
   */
  zoomIn(): void;

  /**
   * Zooms out by one step, centered on the viewport.
   * Snaps to 100% if the result is within the snap threshold.
   */
  zoomOut(): void;

  /**
   * Resets zoom to 1 and pan to { x: 0, y: 0 }.
   */
  resetView(): void;

  /**
   * Fits all registered nodes into the viewport: scales and pans
   * so their union bounding box is centered with padding, never
   * zooming in beyond 100%. Resets the view when no nodes are
   * registered.
   *
   * @param padding - Padding around the fitted nodes, in viewport pixels.
   */
  fitToView(padding?: number): void;

  /**
   * Centers the viewport on a registered node's frame. Does
   * nothing if the node is not registered.
   *
   * @param nodeId - The ID of the node to center on.
   * @param zoom - The zoom level to center at, defaults to 1.
   */
  centerOnNode(nodeId: string, zoom?: number): void;

  /**
   * Centers the viewport on a frame.
   *
   * @param frame - The frame to center on, in canvas coordinates.
   * @param zoom - The zoom level to center at, defaults to 1.
   */
  centerOnFrame(frame: CanvasNodeFrame, zoom?: number): void;

  /**
   * Adds a node's frame to the registry, or replaces it if the
   * node is already registered.
   *
   * @param nodeId - The node ID.
   * @param frame - The node's frame in canvas coordinates.
   */
  registerNode(nodeId: string, frame: CanvasNodeFrame): void;

  /**
   * Applies a partial frame update to a registered node. Does
   * nothing if the node is not registered.
   *
   * @param nodeId - The node ID.
   * @param frame - The frame values to update.
   */
  updateNodeFrame(nodeId: string, frame: Partial<CanvasNodeFrame>): void;

  /**
   * Removes a node's frame from the registry.
   *
   * @param nodeId - The node ID.
   */
  unregisterNode(nodeId: string): void;

  /**
   * Sets the viewport element size.
   *
   * @param size - The new viewport size.
   */
  setViewportSize(size: CanvasViewportSize): void;

  /**
   * Sets whether node drags and resizes snap to the grid.
   *
   * @param enabled - Whether snapping is enabled.
   */
  setSnapToGrid(enabled: boolean): void;

  /**
   * Toggles whether node drags and resizes snap to the grid.
   */
  toggleSnapToGrid(): void;

  /**
   * Starts a drag-to-connect interaction from a node side.
   *
   * @param fromNodeId - The ID of the node the drag is anchored to.
   * @param fromSide - The side of the node the drag is anchored to.
   * @param point - The starting cursor position in canvas coordinates.
   * @param reconnect - The existing connection the drag re-routes, when re-connecting.
   */
  startConnectionDrag(
    fromNodeId: string,
    fromSide: CanvasNodeSide,
    point: CanvasPoint,
    reconnect?: CanvasConnectionReconnect,
  ): void;

  /**
   * Updates the in-progress connection drag's cursor position and
   * hovered target. Does nothing when no drag is in progress.
   *
   * @param point - The cursor position in canvas coordinates.
   * @param target - The hovered target, or null when none is hovered.
   */
  updateConnectionDrag(
    point: CanvasPoint,
    target: CanvasConnectionDragTarget | null,
  ): void;

  /**
   * Clears the in-progress connection drag.
   */
  clearConnectionDrag(): void;

  /**
   * Sets the node side whose connection handle the cursor is
   * near. Skips updates that do not change the hovered handle.
   *
   * @param target - The nearby node side, or null when none is near.
   */
  setHoveredConnectionHandle(target: CanvasConnectionEnd | null): void;
}

/**
 * Creates a canvas viewport store holding zoom, pan and the node
 * registry for a single canvas instance.
 *
 * @param config - Zoom limits and initial transform.
 * @returns The canvas store.
 */
export function createCanvasStore(config: CanvasStoreConfig = {}): CanvasStore {
  const store = createInternalStore(config);

  return {
    useStore: store,
    getZoom: () => store.getState().zoom,
    getPan: () => store.getState().pan,
    getMinZoom: () => store.getState().minZoom,
    getMaxZoom: () => store.getState().maxZoom,
    getViewportSize: () => store.getState().viewportSize,
    getNode: (nodeId) => store.getState().nodes[nodeId] || null,
    getNodes: () => store.getState().nodes,
    getSnapToGrid: () => store.getState().snapToGrid,
    getConnectionDrag: () => store.getState().connectionDrag,
    getHoveredConnectionHandle: () => store.getState().hoveredConnectionHandle,
    setZoom: (zoom, focalPoint) => store.getState().setZoom(zoom, focalPoint),
    setPan: (x, y) => store.getState().setPan(x, y),
    zoomIn: () => store.getState().zoomIn(),
    zoomOut: () => store.getState().zoomOut(),
    resetView: () => store.getState().resetView(),
    fitToView: (padding) => store.getState().fitToView(padding),
    centerOnNode: (nodeId, zoom) => store.getState().centerOnNode(nodeId, zoom),
    centerOnFrame: (frame, zoom) => store.getState().centerOnFrame(frame, zoom),
    registerNode: (nodeId, frame) =>
      store.getState().registerNode(nodeId, frame),
    updateNodeFrame: (nodeId, frame) =>
      store.getState().updateNodeFrame(nodeId, frame),
    unregisterNode: (nodeId) => store.getState().unregisterNode(nodeId),
    setViewportSize: (size) => store.getState().setViewportSize(size),
    setSnapToGrid: (enabled) => store.getState().setSnapToGrid(enabled),
    toggleSnapToGrid: () => store.getState().toggleSnapToGrid(),
    startConnectionDrag: (fromNodeId, fromSide, point, reconnect) =>
      store
        .getState()
        .startConnectionDrag(fromNodeId, fromSide, point, reconnect),
    updateConnectionDrag: (point, target) =>
      store.getState().updateConnectionDrag(point, target),
    clearConnectionDrag: () => store.getState().clearConnectionDrag(),
    setHoveredConnectionHandle: (target) =>
      store.getState().setHoveredConnectionHandle(target),
  };
}

/**
 * Creates the Zustand store backing a canvas instance.
 */
function createInternalStore(config: CanvasStoreConfig) {
  const {
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    initialZoom = 1,
    initialPan = { x: 0, y: 0 },
    initialSnapToGrid = false,
  } = config;

  return createStore<CanvasState>((set, get) => ({
    zoom: initialZoom,
    pan: initialPan,
    minZoom,
    maxZoom,
    viewportSize: { width: 0, height: 0 },
    nodes: {},
    snapToGrid: initialSnapToGrid,
    connectionDrag: null,
    hoveredConnectionHandle: null,

    setZoom: (zoom, focalPoint) => {
      // Clamp zoom to the configured limits
      const clampedZoom = Math.min(maxZoom, Math.max(minZoom, zoom));

      set((state) => {
        if (focalPoint) {
          // Adjust pan so the point under the cursor stays stationary
          const newPanX =
            focalPoint.x -
            (focalPoint.x - state.pan.x) * (clampedZoom / state.zoom);
          const newPanY =
            focalPoint.y -
            (focalPoint.y - state.pan.y) * (clampedZoom / state.zoom);

          return { zoom: clampedZoom, pan: { x: newPanX, y: newPanY } };
        }

        return { zoom: clampedZoom };
      });
    },

    setPan: (x, y) => set({ pan: { x, y } }),

    zoomIn: () => {
      const state = get();

      state.setZoom(snapZoom(state.zoom + ZOOM_STEP), getViewportCenter(state));
    },

    zoomOut: () => {
      const state = get();

      state.setZoom(snapZoom(state.zoom - ZOOM_STEP), getViewportCenter(state));
    },

    resetView: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),

    fitToView: (padding = FIT_PADDING) => {
      const state = get();

      // Compute the fitting transform from the registered node frames
      const transform = computeFitTransform(
        Object.values(state.nodes),
        state.viewportSize,
        { padding, minZoom: state.minZoom },
      );

      // Nothing to fit, reset to the default view
      if (!transform) {
        state.resetView();

        return;
      }

      set({ zoom: transform.zoom, pan: transform.pan });
    },

    centerOnNode: (nodeId, zoom) => {
      const frame = get().nodes[nodeId];

      // The node is not registered
      if (!frame) {
        return;
      }

      get().centerOnFrame(frame, zoom);
    },

    centerOnFrame: (frame, zoom = 1) => {
      const state = get();

      // Clamp the target zoom to the configured limits
      const clampedZoom = Math.min(maxZoom, Math.max(minZoom, zoom));

      // Pan so the frame's center lands on the viewport's center
      const panX =
        state.viewportSize.width / 2 -
        (frame.x + frame.width / 2) * clampedZoom;
      const panY =
        state.viewportSize.height / 2 -
        (frame.y + frame.height / 2) * clampedZoom;

      set({ zoom: clampedZoom, pan: { x: panX, y: panY } });
    },

    registerNode: (id, frame) =>
      set((state) => ({ nodes: { ...state.nodes, [id]: frame } })),

    updateNodeFrame: (id, frame) =>
      set((state) => {
        const existing = state.nodes[id];

        // The node is not registered
        if (!existing) {
          return {};
        }

        return { nodes: { ...state.nodes, [id]: { ...existing, ...frame } } };
      }),

    unregisterNode: (id) =>
      set((state) => {
        const nodes = { ...state.nodes };

        delete nodes[id];

        return { nodes };
      }),

    setViewportSize: (size) => set({ viewportSize: size }),

    setSnapToGrid: (enabled) => set({ snapToGrid: enabled }),

    toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),

    startConnectionDrag: (fromNodeId, fromSide, point, reconnect) =>
      set({
        connectionDrag: {
          fromNodeId,
          fromSide,
          point,
          targetNodeId: null,
          targetSide: null,
          reconnect: reconnect ?? null,
        },
      }),

    updateConnectionDrag: (point, target) =>
      set((state) => {
        // No drag in progress
        if (!state.connectionDrag) {
          return {};
        }

        return {
          connectionDrag: {
            ...state.connectionDrag,
            point,
            targetNodeId: target ? target.nodeId : null,
            targetSide: target ? target.side : null,
          },
        };
      }),

    clearConnectionDrag: () => set({ connectionDrag: null }),

    setHoveredConnectionHandle: (target) =>
      set((state) => {
        const current = state.hoveredConnectionHandle;

        // Skip updates that do not change the hovered handle,
        // since this fires on every cursor move over the canvas
        if (
          current?.nodeId === target?.nodeId &&
          current?.side === target?.side
        ) {
          return {};
        }

        return { hoveredConnectionHandle: target };
      }),
  }));
}

/**
 * Snaps a stepped zoom level to 100% when it lands within the
 * snap threshold, with a tolerance for floating point drift.
 */
function snapZoom(zoom: number): number {
  if (Math.abs(zoom - 1) <= ZOOM_SNAP_THRESHOLD + Number.EPSILON) {
    return 1;
  }

  return zoom;
}

/**
 * Returns the center point of the viewport from its measured size.
 */
function getViewportCenter(state: CanvasState): { x: number; y: number } {
  return {
    x: state.viewportSize.width / 2,
    y: state.viewportSize.height / 2,
  };
}
