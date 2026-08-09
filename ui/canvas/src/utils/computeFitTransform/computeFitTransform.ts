import { DEFAULT_MIN_ZOOM, FIT_PADDING } from '../../constants';
import { CanvasNodeFrame, CanvasPoint, CanvasViewportSize } from '../../types';

export interface FitTransform {
  /**
   * The zoom level that fits the frames.
   */
  zoom: number;

  /**
   * The pan offset that centers the frames.
   */
  pan: CanvasPoint;
}

export interface ComputeFitTransformOptions {
  /**
   * Padding around the fitted frames, in viewport pixels.
   */
  padding?: number;

  /**
   * The lowest zoom level the fit may produce.
   */
  minZoom?: number;

  /**
   * The highest zoom level the fit may produce.
   */
  maxZoom?: number;
}

/**
 * Computes the zoom and pan that fit a set of frames into the
 * viewport: the largest zoom at which the frames' union bounding
 * box fits with padding, centered. Never zooms in beyond maxZoom
 * (100% by default).
 *
 * @param frames - The frames to fit, in canvas coordinates.
 * @param viewportSize - The viewport size in pixels.
 * @param options - Padding and zoom bounds.
 * @returns The fitting transform, or null when there is nothing to fit.
 */
export function computeFitTransform(
  frames: CanvasNodeFrame[],
  viewportSize: CanvasViewportSize,
  options: ComputeFitTransformOptions = {},
): FitTransform | null {
  const {
    padding = FIT_PADDING,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = 1,
  } = options;

  // Nothing to fit without frames or a measured viewport
  if (!frames.length || !viewportSize.width || !viewportSize.height) {
    return null;
  }

  // Union bounding box of all frames in canvas coordinates
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  frames.forEach((frame) => {
    minX = Math.min(minX, frame.x);
    minY = Math.min(minY, frame.y);
    maxX = Math.max(maxX, frame.x + frame.width);
    maxY = Math.max(maxY, frame.y + frame.height);
  });

  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;

  // Largest zoom that fits the bounds plus padding, clamped to
  // the zoom limits
  const zoom = Math.max(
    minZoom,
    Math.min(
      maxZoom,
      (viewportSize.width - padding * 2) / boundsWidth,
      (viewportSize.height - padding * 2) / boundsHeight,
    ),
  );

  // Pan to center the bounds in the viewport
  const panX = (viewportSize.width - boundsWidth * zoom) / 2 - minX * zoom;
  const panY = (viewportSize.height - boundsHeight * zoom) / 2 - minY * zoom;

  return { zoom, pan: { x: panX, y: panY } };
}
