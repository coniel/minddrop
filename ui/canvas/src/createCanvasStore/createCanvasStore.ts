import { createStore } from '@minddrop/stores';
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  FIT_PADDING,
  ZOOM_SNAP_THRESHOLD,
  ZOOM_STEP,
} from '../constants';
import { CanvasState, CanvasStore, CanvasStoreConfig } from '../types';
import {
  computeFitTransform,
  getSelectedIds,
  getSelectionUpdate,
  getToggleSelectionUpdate,
} from '../utils';

// The store's interface lives with the rest of the canvas types,
// and is re-exported here alongside the factory that returns it
export type { CanvasStore } from '../types';

/**
 * The internal Zustand store backing a canvas instance.
 */
export type CanvasUseStore = ReturnType<typeof createInternalStore>;

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
    getSnapToObjects: () => store.getState().snapToObjects,
    getSelectable: () => store.getState().selectable,
    getSelection: () => store.getState().selection,
    getSelectedNodeIds: () => getSelectedIds(store.getState(), 'nodes'),
    getSelectedConnectionIds: () =>
      getSelectedIds(store.getState(), 'connections'),
    isNodeSelected: (nodeId) =>
      getSelectedIds(store.getState(), 'nodes').includes(nodeId),
    isConnectionSelected: (connectionId) =>
      getSelectedIds(store.getState(), 'connections').includes(connectionId),
    getLasso: () => store.getState().lasso,
    getSelectionPoint: () => store.getState().selectionPoint,
    setSelectionPoint: (point) => store.getState().setSelectionPoint(point),
    getSelectionDrag: () => store.getState().selectionDrag,
    hitTestConnections: (frame) => {
      const { connectionGeometry } = store.getState();

      // No connections layer is mounted on this canvas
      return connectionGeometry ? connectionGeometry.hitTest(frame) : [];
    },
    getConnectionBounds: (ids) => {
      const { connectionGeometry } = store.getState();

      // No connections layer is mounted on this canvas
      return connectionGeometry ? connectionGeometry.getBounds(ids) : null;
    },
    getAlignmentGuides: () => store.getState().alignmentGuides,
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
    setSnapToObjects: (enabled) => store.getState().setSnapToObjects(enabled),
    toggleSnapToObjects: () => store.getState().toggleSnapToObjects(),
    selectNodes: (ids, additive) => store.getState().selectNodes(ids, additive),
    selectConnections: (ids, additive) =>
      store.getState().selectConnections(ids, additive),
    toggleNodeSelection: (id) => store.getState().toggleNodeSelection(id),
    toggleConnectionSelection: (id) =>
      store.getState().toggleConnectionSelection(id),
    clearSelection: () => store.getState().clearSelection(),
    startLasso: (origin, additive) =>
      store.getState().startLasso(origin, additive),
    updateLasso: (point) => store.getState().updateLasso(point),
    clearLasso: () => store.getState().clearLasso(),
    startSelectionDrag: () => store.getState().startSelectionDrag(),
    updateSelectionDrag: (offset) =>
      store.getState().updateSelectionDrag(offset),
    clearSelectionDrag: () => store.getState().clearSelectionDrag(),
    setConnectionGeometry: (geometry) =>
      store.getState().setConnectionGeometry(geometry),
    setAlignmentGuides: (guides) => store.getState().setAlignmentGuides(guides),
    startConnectionDrag: (fromNodeId, fromSide, point, reconnect, fromOffset) =>
      store
        .getState()
        .startConnectionDrag(
          fromNodeId,
          fromSide,
          point,
          reconnect,
          fromOffset,
        ),
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
    initialSnapToObjects = false,
    selectable = true,
  } = config;

  return createStore<CanvasState>((set, get) => ({
    zoom: initialZoom,
    pan: initialPan,
    minZoom,
    maxZoom,
    viewportSize: { width: 0, height: 0 },
    nodes: {},
    snapToGrid: initialSnapToGrid,
    snapToObjects: initialSnapToObjects,
    selectable,
    selection: null,
    selectionPoint: null,
    lasso: null,
    selectionDrag: null,
    connectionGeometry: null,
    alignmentGuides: [],
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

    setSnapToObjects: (enabled) => set({ snapToObjects: enabled }),

    toggleSnapToObjects: () =>
      set((state) => ({ snapToObjects: !state.snapToObjects })),

    selectNodes: (ids, additive) =>
      set((state) => getSelectionUpdate(state, 'nodes', ids, additive)),

    selectConnections: (ids, additive) =>
      set((state) => getSelectionUpdate(state, 'connections', ids, additive)),

    toggleNodeSelection: (id) =>
      set((state) => getToggleSelectionUpdate(state, 'nodes', id)),

    toggleConnectionSelection: (id) =>
      set((state) => getToggleSelectionUpdate(state, 'connections', id)),

    clearSelection: () =>
      set((state) =>
        state.selection ? { selection: null, selectionPoint: null } : {},
      ),

    setSelectionPoint: (point) => set({ selectionPoint: point }),

    startLasso: (origin, additive) =>
      set((state) => {
        // Selection is disabled for this canvas instance
        if (!state.selectable) {
          return {};
        }

        return { lasso: { origin, point: origin, additive } };
      }),

    updateLasso: (point) =>
      set((state) => {
        // No lasso drag in progress
        if (!state.lasso) {
          return {};
        }

        return { lasso: { ...state.lasso, point } };
      }),

    clearLasso: () => set((state) => (state.lasso ? { lasso: null } : {})),

    startSelectionDrag: () =>
      set((state) => {
        // Selection is disabled for this canvas instance
        if (!state.selectable) {
          return {};
        }

        return { selectionDrag: { x: 0, y: 0 } };
      }),

    updateSelectionDrag: (offset) =>
      set((state) => {
        // No group drag in progress
        if (!state.selectionDrag) {
          return {};
        }

        return { selectionDrag: offset };
      }),

    clearSelectionDrag: () =>
      set((state) => (state.selectionDrag ? { selectionDrag: null } : {})),

    setConnectionGeometry: (geometry) => set({ connectionGeometry: geometry }),

    setAlignmentGuides: (guides) =>
      set((state) => {
        // Skip updates that leave the guides empty, since this
        // fires on every frame of a node drag
        if (!guides.length && !state.alignmentGuides.length) {
          return {};
        }

        return { alignmentGuides: guides };
      }),

    startConnectionDrag: (fromNodeId, fromSide, point, reconnect, fromOffset) =>
      set({
        connectionDrag: {
          fromNodeId,
          fromSide,
          fromOffset,
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
            targetOffset: target ? target.offset : undefined,
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
