/**
 * Calls back after the given number of animation frames have
 * passed. Calls back at once for zero frames.
 *
 * @param frames - The number of frames to wait.
 * @param callback - Called once the frames have passed.
 */
export function waitFrames(frames: number, callback: VoidFunction): void {
  // Check if the frames have passed. If so, call back.
  if (frames <= 0) {
    callback();

    return;
  }

  // Wait a frame, then count it off
  requestAnimationFrame(() => waitFrames(frames - 1, callback));
}
