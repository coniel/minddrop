export interface CaptureScreenRegionOptions {
  /**
   * Horizontal position of the region's left edge in screen
   * coordinates.
   */
  x: number;

  /**
   * Vertical position of the region's top edge in screen
   * coordinates.
   */
  y: number;

  /**
   * Width of the region.
   */
  width: number;

  /**
   * Height of the region.
   */
  height: number;

  /**
   * Name of the written file, without an extension.
   */
  fileName: string;
}

export interface ScreenshotAdapter {
  /**
   * Returns the screen position of the app viewport's top left
   * corner, given the cursor's current position within the viewport.
   *
   * @param cursorX - Horizontal position of the cursor in the viewport.
   * @param cursorY - Vertical position of the cursor in the viewport.
   */
  getViewportScreenOrigin(
    cursorX: number,
    cursorY: number,
  ): Promise<{ x: number; y: number }>;

  /**
   * Captures a region of the screen to an image file.
   *
   * @param options - The region and file name to capture to.
   * @returns The path of the written file.
   */
  captureScreenRegion(options: CaptureScreenRegionOptions): Promise<string>;
}
