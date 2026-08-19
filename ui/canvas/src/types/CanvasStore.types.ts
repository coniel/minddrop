// The internal store's type is derived from its implementation,
// so it is imported back into the types it is described in
import type { CanvasUseStore } from '../createCanvasStore';
import { CanvasAlignmentGuide } from './CanvasAlignment.types';
import {
  CanvasConnectionDrag,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasNodeSide,
} from './CanvasConnection.types';
import { CanvasNodeFrame, CanvasPoint } from './CanvasNode.types';
import {
  CanvasConnectionGeometry,
  CanvasLassoState,
  CanvasSelection,
} from './CanvasSelection.types';
import { CanvasGrid, CanvasViewportSize } from './CanvasState.types';

/**
 * The API of a canvas instance's store, wrapping its state in
 * getters and actions.
 */
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
   * Returns the in-progress drag-to-select marquee, or null when
   * no lasso drag is in progress.
   */
  getLasso(): CanvasLassoState | null;

  /**
   * Returns the point the current selection was made at, or null
   * when it was not made by a pointer interaction.
   */
  getSelectionPoint(): CanvasPoint | null;

  /**
   * Records the point the current selection was made at. Any
   * later selection change clears it, so it is set immediately
   * after selecting.
   *
   * @param point - The point in canvas coordinates.
   */
  setSelectionPoint(point: CanvasPoint): void;

  /**
   * Returns the offset of the in-progress group drag, or null
   * when no group drag is in progress.
   */
  getSelectionDrag(): CanvasPoint | null;

  /**
   * Returns the IDs of the connections a frame touches, empty
   * when no connections layer is mounted.
   *
   * @param frame - The frame to test, in canvas coordinates.
   */
  hitTestConnections(frame: CanvasNodeFrame): string[];

  /**
   * Returns the frame enclosing the given connections, or null
   * when none of them resolve.
   *
   * @param ids - The IDs of the connections to enclose.
   */
  getConnectionBounds(ids: string[]): CanvasNodeFrame | null;

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
   * Returns the background grid pattern.
   */
  getGrid(): CanvasGrid;

  /**
   * Sets the background grid pattern.
   *
   * @param grid - The grid pattern to render.
   */
  setGrid(grid: CanvasGrid): void;

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
   * Starts a drag-to-select marquee. Does nothing when the canvas
   * is not selectable.
   *
   * @param origin - The point the drag started from, in canvas coordinates.
   * @param additive - Whether the lasso adds to the existing selection.
   */
  startLasso(origin: CanvasPoint, additive: boolean): void;

  /**
   * Updates the in-progress marquee's cursor position. Does
   * nothing when no lasso drag is in progress.
   *
   * @param point - The cursor position in canvas coordinates.
   */
  updateLasso(point: CanvasPoint): void;

  /**
   * Clears the in-progress marquee.
   */
  clearLasso(): void;

  /**
   * Starts a group drag of the selected nodes at a zero offset.
   */
  startSelectionDrag(): void;

  /**
   * Updates the in-progress group drag's offset. Does nothing
   * when no group drag is in progress.
   *
   * @param offset - The offset from the drag's start, in canvas coordinates.
   */
  updateSelectionDrag(offset: CanvasPoint): void;

  /**
   * Clears the in-progress group drag.
   */
  clearSelectionDrag(): void;

  /**
   * Registers the geometry queries against the canvas's
   * connections.
   *
   * @param geometry - The geometry queries, or null to unregister.
   */
  setConnectionGeometry(geometry: CanvasConnectionGeometry | null): void;

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
   * @param fromOffset - The anchored end's offset along its side, midpoint when omitted.
   */
  startConnectionDrag(
    fromNodeId: string,
    fromSide: CanvasNodeSide,
    point: CanvasPoint,
    reconnect?: CanvasConnectionReconnect,
    fromOffset?: number,
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
