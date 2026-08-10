import { createStore } from '@minddrop/stores';
import { sameIds } from '@minddrop/utils';
import {
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  FIT_PADDING,
  ZOOM_SNAP_THRESHOLD,
  ZOOM_STEP,
} from '../constants';
import {
  CanvasAlignmentGuide,
  CanvasConnectionDrag,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasNodeFrame,
  CanvasNodeSide,
  CanvasPoint,
  CanvasSelection,
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
   * Returns whether node drags and resizes snap to other
   * nodes.
   */
  getSnapToObjects(): boolean;

  /**
   * Returns whether nodes and connections on the canvas can be
   * selected.
   */
  getSelectable(): boolean;

  /**
   * Returns the current selection, or null when nothing is
   * selected.
   */
  getSelection(): CanvasSelection | null;

  /**
   * Returns the IDs of the selected nodes, empty when the
   * selection contains connections.
   */
  getSelectedNodeIds(): string[];

  /**
   * Returns the IDs of the selected connections, empty when the
   * selection contains nodes.
   */
  getSelectedConnectionIds(): string[];

  /**
   * Returns whether a node is selected.
   *
   * @param nodeId - The ID of the node to check.
   */
  isNodeSelected(nodeId: string): boolean;

  /**
   * Returns whether a connection is selected.
   *
   * @param connectionId - The ID of the connection to check.
   */
  isConnectionSelected(connectionId: string): boolean;

  /**
   * Returns the alignment guides for the node being dragged or
   * resized.
   */
  getAlignmentGuides(): CanvasAlignmentGuide[];

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
   * Sets whether node drags and resizes snap to the edges and
   * centers of the other nodes on the canvas.
   *
   * @param enabled - Whether snapping is enabled.
   */
  setSnapToObjects(enabled: boolean): void;

  /**
   * Toggles whether node drags and resizes snap to other nodes.
   */
  toggleSnapToObjects(): void;

  /**
   * Selects the given nodes, replacing a connection selection.
   * Selecting no nodes clears the selection.
   *
   * @param ids - The IDs of the nodes to select.
   * @param additive - Whether to add to an existing node selection.
   */
  selectNodes(ids: string[], additive?: boolean): void;

  /**
   * Selects the given connections, replacing a node selection.
   * Selecting no connections clears the selection.
   *
   * @param ids - The IDs of the connections to select.
   * @param additive - Whether to add to an existing connection selection.
   */
  selectConnections(ids: string[], additive?: boolean): void;

  /**
   * Adds a node to the selection, or removes it when already
   * selected. Replaces a connection selection.
   *
   * @param id - The ID of the node to toggle.
   */
  toggleNodeSelection(id: string): void;

  /**
   * Adds a connection to the selection, or removes it when already
   * selected. Replaces a node selection.
   *
   * @param id - The ID of the connection to toggle.
   */
  toggleConnectionSelection(id: string): void;

  /**
   * Clears the selection.
   */
  clearSelection(): void;

  /**
   * Sets the alignment guides for the node being dragged or
   * resized.
   *
   * @param guides - The guides to show.
   */
  setAlignmentGuides(guides: CanvasAlignmentGuide[]): void;

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
    setAlignmentGuides: (guides) => store.getState().setAlignmentGuides(guides),
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
      set((state) => getToggleUpdate(state, 'nodes', id)),

    toggleConnectionSelection: (id) =>
      set((state) => getToggleUpdate(state, 'connections', id)),

    clearSelection: () =>
      set((state) => (state.selection ? { selection: null } : {})),

    setAlignmentGuides: (guides) =>
      set((state) => {
        // Skip updates that leave the guides empty, since this
        // fires on every frame of a node drag
        if (!guides.length && !state.alignmentGuides.length) {
          return {};
        }

        return { alignmentGuides: guides };
      }),

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
 * Returns the IDs in the selection when it is of the given type,
 * and an empty list otherwise.
 */
function getSelectedIds(
  state: CanvasState,
  type: CanvasSelection['type'],
): string[] {
  return state.selection?.type === type ? state.selection.ids : [];
}

/**
 * Returns the state update selecting the given IDs, merging them
 * into the current selection when additive.
 */
function getSelectionUpdate(
  state: CanvasState,
  type: CanvasSelection['type'],
  ids: string[],
  additive?: boolean,
): Partial<CanvasState> {
  // Selection is disabled for this canvas instance
  if (!state.selectable) {
    return {};
  }

  // A selection of the other type is replaced rather than merged
  // into, so additive only carries over matching selections
  const current = additive ? getSelectedIds(state, type) : [];
  const selectedIds = current.length
    ? Array.from(new Set([...current, ...ids]))
    : ids;

  // Selecting nothing clears the selection
  if (!selectedIds.length) {
    return state.selection ? { selection: null } : {};
  }

  // Skip updates that do not change the selection, since the
  // lasso recomputes it on every frame of a drag
  if (
    state.selection?.type === type &&
    sameIds(state.selection.ids, selectedIds)
  ) {
    return {};
  }

  return { selection: { type, ids: selectedIds } };
}

/**
 * Returns the state update adding an ID to the selection, or
 * removing it when it is already selected.
 */
function getToggleUpdate(
  state: CanvasState,
  type: CanvasSelection['type'],
  id: string,
): Partial<CanvasState> {
  // Selection is disabled for this canvas instance
  if (!state.selectable) {
    return {};
  }

  const current = getSelectedIds(state, type);

  // Remove the ID when it is already selected, add it otherwise
  const selectedIds = current.includes(id)
    ? current.filter((selectedId) => selectedId !== id)
    : [...current, id];

  // Deselecting the last item clears the selection
  if (!selectedIds.length) {
    return { selection: null };
  }

  return { selection: { type, ids: selectedIds } };
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
