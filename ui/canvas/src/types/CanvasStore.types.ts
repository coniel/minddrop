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
}
