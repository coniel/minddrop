import { registerScreenshotAdapter } from '@minddrop/feature-dev-tools';

/**
 * Registers a screenshot adapter that forwards screen capture
 * requests to the Bun process via RPC.
 */
export function registerScreenshotAdapterRpc(rpc: any): void {
  registerScreenshotAdapter({
    getViewportScreenOrigin: (cursorX, cursorY) =>
      rpc.request.getViewportScreenOrigin({ cursorX, cursorY }),

    captureScreenRegion: (options) => rpc.request.captureScreenRegion(options),
  });
}
