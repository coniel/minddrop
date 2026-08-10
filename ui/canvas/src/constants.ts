import { CanvasConnectionThickness } from './types';

/** Default minimum zoom level. */
export const DEFAULT_MIN_ZOOM = 0.1;

/** Default maximum zoom level. */
export const DEFAULT_MAX_ZOOM = 3;

/** Amount to step when zooming with buttons or keyboard. */
export const ZOOM_STEP = 0.1;

/** Distance from 100% within which stepped zoom snaps to 100%. */
export const ZOOM_SNAP_THRESHOLD = 0.05;

/** Default padding around fitted nodes, in viewport pixels. */
export const FIT_PADDING = 64;

/** Default minimum node width. */
export const NODE_MIN_WIDTH = 200;

/** Default minimum node height. */
export const NODE_MIN_HEIGHT = 100;

/** Dot grid spacing at 100% zoom, in pixels. */
export const GRID_SIZE = 24;

/**
 * Distance in screen pixels within which a dragged node snaps to
 * another node's edges or center.
 */
export const OBJECT_SNAP_DISTANCE = 6;

/** Tolerance within which two alignment lines count as aligned. */
export const ALIGNMENT_TOLERANCE = 0.01;

/**
 * Distance from a node in screen pixels within which connection
 * interactions engage: an edge's connection handle shows, and a
 * connection drag snaps to the node as its target.
 */
export const CONNECTION_PROXIMITY = 20;

/** Connection stroke width for each thickness setting. */
export const CONNECTION_THICKNESSES: Record<CanvasConnectionThickness, number> =
  {
    thin: 1,
    medium: 2,
    thick: 4,
  };

/** Extra stroke width of the connection hover/selection halo. */
export const CONNECTION_HALO_WIDTH = 10;

/**
 * Cursor travel in screen pixels before a press on a connection
 * starts a re-connect drag rather than a click.
 */
export const CONNECTION_RECONNECT_DRAG_THRESHOLD = 4;

/**
 * Connection arrowhead size for each thickness setting, in canvas
 * pixels. Sized per thickness rather than scaled with the stroke,
 * which would grow thick-line arrowheads past the routing stubs.
 */
export const CONNECTION_ARROW_SIZES: Record<CanvasConnectionThickness, number> =
  {
    thin: 8,
    medium: 12,
    thick: 16,
  };

/** Length of the stub leaving each side on straight-shape connections. */
export const CONNECTION_ELBOW_STUB = 24;

/** Minimum distance connection curve control points extend from their side. */
export const CONNECTION_CURVE_MIN_OFFSET = 40;

/** Maximum distance connection curve control points extend from their side. */
export const CONNECTION_CURVE_MAX_OFFSET = 200;
