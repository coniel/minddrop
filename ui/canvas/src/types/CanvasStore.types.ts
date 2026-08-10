import { CanvasAlignmentGuide } from './CanvasAlignment.types';
import {
  CanvasConnectionDrag,
  CanvasConnectionDragTarget,
  CanvasConnectionEnd,
  CanvasConnectionReconnect,
  CanvasNodeSide,
} from './CanvasConnection.types';
import { CanvasNodeFrame, CanvasPoint } from './CanvasNode.types';

/**
 * The size of the canvas viewport element in pixels.
 */
export interface CanvasViewportSize {
  /**
   * The viewport width.
   */
  width: number;

  /**
   * The viewport height.
   */
  height: number;
}

/**
 * Configuration options for creating a canvas store.
 */
export interface CanvasStoreConfig {
  /**
   * The minimum zoom level.
   */
  minZoom?: number;

  /**
   * The maximum zoom level.
   */
  maxZoom?: number;

  /**
   * The initial zoom level.
   */
  initialZoom?: number;

  /**
   * The initial pan offset.
   */
  initialPan?: CanvasPoint;

  /**
   * Whether node interactions snap to the grid initially.
   */
  initialSnapToGrid?: boolean;

  /**
   * Whether node interactions snap to other nodes initially.
   */
  initialSnapToObjects?: boolean;
}

/**
 * Viewport and node registry state for a single canvas instance.
 */
export interface CanvasState {
  /**
   * The current zoom level (1 = 100%).
   */
  zoom: number;

  /**
   * The current pan offset in pixels.
   */
  pan: CanvasPoint;

  /**
   * The minimum zoom level.
   */
  minZoom: number;

  /**
   * The maximum zoom level.
   */
  maxZoom: number;

  /**
   * The size of the viewport element, kept up to date by the
   * Canvas component. Zero until the viewport has mounted.
   */
  viewportSize: CanvasViewportSize;

  /**
   * Registry of mounted node frames by node ID, used for
   * state-driven fit and centering computations.
   */
  nodes: Record<string, CanvasNodeFrame>;

  /**
   * Whether node drags and resizes snap to the canvas grid.
   */
  snapToGrid: boolean;

  /**
   * Whether node drags and resizes snap to the edges and centers
   * of the other nodes on the canvas.
   */
  snapToObjects: boolean;

  /**
   * The alignment guides for the node being dragged or resized,
   * empty when no node is aligned with another.
   */
  alignmentGuides: CanvasAlignmentGuide[];

  /**
   * The in-progress drag-to-connect interaction, or null when no
   * connection is being dragged.
   */
  connectionDrag: CanvasConnectionDrag | null;

  /**
   * The node side whose edge the cursor is near, revealing its
   * connection handle. Tracked by the Canvas component from
   * viewport cursor movement, so edges are detected from both
   * inside and outside their node.
   */
  hoveredConnectionHandle: CanvasConnectionEnd | null;

  /**
   * Sets the zoom level, optionally zooming toward a focal point.
   * @param zoom - The new zoom level (clamped to minZoom–maxZoom).
   * @param focalPoint - The point in viewport coordinates to zoom toward.
   */
  setZoom: (zoom: number, focalPoint?: CanvasPoint) => void;

  /**
   * Sets the pan offset.
   * @param x - The horizontal offset.
   * @param y - The vertical offset.
   */
  setPan: (x: number, y: number) => void;

  /**
   * Zooms in by one step, centered on the viewport.
   * Snaps to 100% if the result is within the snap threshold.
   */
  zoomIn: () => void;

  /**
   * Zooms out by one step, centered on the viewport.
   * Snaps to 100% if the result is within the snap threshold.
   */
  zoomOut: () => void;

  /**
   * Resets zoom to 1 and pan to { x: 0, y: 0 }.
   */
  resetView: () => void;

  /**
   * Fits all registered nodes into the viewport: scales and pans
   * so their union bounding box is centered with padding, never
   * zooming in beyond 100%. Resets the view when no nodes are
   * registered.
   * @param padding - Padding around the fitted nodes, in viewport pixels.
   */
  fitToView: (padding?: number) => void;

  /**
   * Centers the viewport on a registered node's frame. Does
   * nothing if the node is not registered.
   * @param nodeId - The ID of the node to center on.
   * @param zoom - The zoom level to center at, defaults to 1.
   */
  centerOnNode: (nodeId: string, zoom?: number) => void;

  /**
   * Centers the viewport on a frame.
   * @param frame - The frame to center on, in canvas coordinates.
   * @param zoom - The zoom level to center at, defaults to 1.
   */
  centerOnFrame: (frame: CanvasNodeFrame, zoom?: number) => void;

  /**
   * Adds a node's frame to the registry, or replaces it if the
   * node is already registered.
   * @param id - The node ID.
   * @param frame - The node's frame in canvas coordinates.
   */
  registerNode: (id: string, frame: CanvasNodeFrame) => void;

  /**
   * Applies a partial frame update to a registered node. Does
   * nothing if the node is not registered.
   * @param id - The node ID.
   * @param frame - The frame values to update.
   */
  updateNodeFrame: (id: string, frame: Partial<CanvasNodeFrame>) => void;

  /**
   * Removes a node's frame from the registry.
   * @param id - The node ID.
   */
  unregisterNode: (id: string) => void;

  /**
   * Sets the viewport element size.
   * @param size - The new viewport size.
   */
  setViewportSize: (size: CanvasViewportSize) => void;

  /**
   * Sets whether node drags and resizes snap to the grid.
   * @param enabled - Whether snapping is enabled.
   */
  setSnapToGrid: (enabled: boolean) => void;

  /**
   * Toggles whether node drags and resizes snap to the grid.
   */
  toggleSnapToGrid: () => void;

  /**
   * Sets whether node drags and resizes snap to other nodes.
   * @param enabled - Whether snapping is enabled.
   */
  setSnapToObjects: (enabled: boolean) => void;

  /**
   * Toggles whether node drags and resizes snap to other nodes.
   */
  toggleSnapToObjects: () => void;

  /**
   * Sets the alignment guides for the node being dragged or
   * resized. Skips updates that leave the guides empty.
   * @param guides - The guides to show.
   */
  setAlignmentGuides: (guides: CanvasAlignmentGuide[]) => void;

  /**
   * Starts a drag-to-connect interaction from a node side.
   * @param fromNodeId - The ID of the node the drag is anchored to.
   * @param fromSide - The side of the node the drag is anchored to.
   * @param point - The starting cursor position in canvas coordinates.
   * @param reconnect - The existing connection the drag re-routes, when re-connecting.
   */
  startConnectionDrag: (
    fromNodeId: string,
    fromSide: CanvasNodeSide,
    point: CanvasPoint,
    reconnect?: CanvasConnectionReconnect,
  ) => void;

  /**
   * Updates the in-progress connection drag's cursor position and
   * hovered target. Does nothing when no drag is in progress.
   * @param point - The cursor position in canvas coordinates.
   * @param target - The hovered target, or null when none is hovered.
   */
  updateConnectionDrag: (
    point: CanvasPoint,
    target: CanvasConnectionDragTarget | null,
  ) => void;

  /**
   * Clears the in-progress connection drag.
   */
  clearConnectionDrag: () => void;

  /**
   * Sets the node side whose connection handle the cursor is
   * near. Skips updates that do not change the hovered handle.
   * @param target - The nearby node side, or null when none is near.
   */
  setHoveredConnectionHandle: (target: CanvasConnectionEnd | null) => void;
}
