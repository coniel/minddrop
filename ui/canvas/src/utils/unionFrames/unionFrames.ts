import { CanvasNodeFrame } from '../../types';

/**
 * Returns the frame enclosing every given frame, or null when
 * given none.
 *
 * @param frames - The frames to enclose, in canvas coordinates.
 * @returns The enclosing frame, or null when there are no frames.
 */
export function unionFrames(frames: CanvasNodeFrame[]): CanvasNodeFrame | null {
  // Nothing to enclose
  if (!frames.length) {
    return null;
  }

  const left = Math.min(...frames.map((frame) => frame.x));
  const top = Math.min(...frames.map((frame) => frame.y));
  const right = Math.max(...frames.map((frame) => frame.x + frame.width));
  const bottom = Math.max(...frames.map((frame) => frame.y + frame.height));

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}
