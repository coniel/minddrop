import { CanvasNodeFrame } from '../../types';
import { unionFrames } from '../unionFrames';

/**
 * An edge or axis that a set of frames can be aligned along.
 */
export type CanvasFrameAlignment =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

/**
 * Aligns frames along an edge or axis of their shared bounds,
 * returning only the frames the alignment moves.
 *
 * @param frames - The frames to align, keyed by ID.
 * @param alignment - The edge or axis to align along.
 * @returns The moved frames, keyed by ID.
 */
export function alignFrames(
  frames: Record<string, CanvasNodeFrame>,
  alignment: CanvasFrameAlignment,
): Record<string, CanvasNodeFrame> {
  const bounds = unionFrames(Object.values(frames));

  // Nothing to align against
  if (!bounds) {
    return {};
  }

  const aligned: Record<string, CanvasNodeFrame> = {};

  Object.entries(frames).forEach(([id, frame]) => {
    const moved = {
      ...frame,
      x: getAlignedX(frame, bounds, alignment),
      y: getAlignedY(frame, bounds, alignment),
    };

    // Frames already on the alignment stay as they are, so the
    // caller has nothing to write for them
    if (moved.x === frame.x && moved.y === frame.y) {
      return;
    }

    aligned[id] = moved;
  });

  return aligned;
}

/**
 * Returns a frame's horizontal position after alignment, left
 * where the alignment is vertical.
 */
function getAlignedX(
  frame: CanvasNodeFrame,
  bounds: CanvasNodeFrame,
  alignment: CanvasFrameAlignment,
): number {
  if (alignment === 'left') {
    return bounds.x;
  }

  if (alignment === 'center') {
    return bounds.x + (bounds.width - frame.width) / 2;
  }

  if (alignment === 'right') {
    return bounds.x + bounds.width - frame.width;
  }

  return frame.x;
}

/**
 * Returns a frame's vertical position after alignment, left where
 * the alignment is horizontal.
 */
function getAlignedY(
  frame: CanvasNodeFrame,
  bounds: CanvasNodeFrame,
  alignment: CanvasFrameAlignment,
): number {
  if (alignment === 'top') {
    return bounds.y;
  }

  if (alignment === 'middle') {
    return bounds.y + (bounds.height - frame.height) / 2;
  }

  if (alignment === 'bottom') {
    return bounds.y + bounds.height - frame.height;
  }

  return frame.y;
}
