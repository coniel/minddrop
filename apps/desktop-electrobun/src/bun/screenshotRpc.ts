import { Screen } from 'electrobun/bun';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Captured screenshots are written outside the repo so that rejected
// shots don't have to be pruned from version control
const OUTPUT_DIR = join(homedir(), 'Desktop', 'MindDrop Screenshots');

export interface ViewportScreenOriginParams {
  /**
   * Horizontal position of the cursor within the viewport.
   */
  cursorX: number;

  /**
   * Vertical position of the cursor within the viewport.
   */
  cursorY: number;
}

export interface CaptureScreenRegionParams {
  /**
   * Horizontal position of the region's left edge in screen
   * coordinates, in points.
   */
  x: number;

  /**
   * Vertical position of the region's top edge in screen
   * coordinates, in points.
   */
  y: number;

  /**
   * Width of the region in points.
   */
  width: number;

  /**
   * Height of the region in points.
   */
  height: number;

  /**
   * Name of the written file, without an extension.
   */
  fileName: string;
}

export const screenshotRpcHandlers = {
  /**
   * Returns the screen position of the webview viewport's top left
   * corner, derived by comparing the cursor's position within the
   * viewport against its position on screen.
   *
   * Deriving the origin from the cursor rather than the window frame
   * keeps it correct regardless of which display the window is on and
   * of any inset between the window frame and the webview.
   */
  getViewportScreenOrigin: ({
    cursorX,
    cursorY,
  }: ViewportScreenOriginParams) => {
    const cursor = Screen.getCursorScreenPoint();

    return { x: cursor.x - cursorX, y: cursor.y - cursorY };
  },

  /**
   * Captures a region of the screen to a PNG file, returning the
   * path of the written file.
   *
   * Captures at the display's native resolution, so a region on a
   * 2x display produces an image twice its size in points.
   */
  captureScreenRegion: async ({
    x,
    y,
    width,
    height,
    fileName,
  }: CaptureScreenRegionParams): Promise<string> => {
    // Screen capture is implemented via the macOS `screencapture` binary
    if (process.platform !== 'darwin') {
      throw new Error('Screenshot capture is only supported on macOS');
    }

    if (width < 1 || height < 1) {
      throw new Error('Capture region is empty');
    }

    // Create the output directory on first capture
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Keep the name to a single path segment
    const safeFileName = fileName.replace(/[/\\]/g, '-') || 'screenshot';

    const filePath = join(OUTPUT_DIR, `${safeFileName}.png`);

    // `screencapture` takes the region as whole points
    const region = [x, y, width, height].map(Math.round).join(',');

    // -x silences the shutter sound, -R selects the region to capture
    const captureProcess = Bun.spawn(
      ['screencapture', '-x', '-t', 'png', '-R', region, filePath],
      { stderr: 'pipe' },
    );

    const exitCode = await captureProcess.exited;

    // `screencapture` reports a failure to create the image both when a
    // region is off screen and when it is denied Screen Recording
    // permission, which is the far more common cause
    if (exitCode !== 0) {
      const stderr = await new Response(captureProcess.stderr).text();

      throw new Error(
        `Screen capture failed (${stderr.trim()}). Grant Screen Recording permission to the app running the dev server, then restart it.`,
      );
    }

    return filePath;
  },
};
