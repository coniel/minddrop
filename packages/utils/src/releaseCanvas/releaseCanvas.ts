/**
 * Releases a canvas's pixels by zeroing its size. Otherwise WebKit
 * keeps a canvas's pixels until the canvas is garbage collected. For
 * large canvases this slows the compositor.
 *
 * @param canvas - The canvas to release.
 */
export function releaseCanvas(canvas: HTMLCanvasElement): void {
  // Zero the canvas's size
  canvas.width = 0;
  canvas.height = 0;
}
