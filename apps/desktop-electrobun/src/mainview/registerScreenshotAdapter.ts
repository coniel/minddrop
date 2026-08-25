import { registerScreenshotAdapter } from '@minddrop/feature-dev-tools';
import type { WebviewRpcClient } from '../types';

/**
 * Registers a screenshot adapter that forwards screen capture
 * requests to the Bun process via RPC.
 */
export function registerScreenshotAdapterRpc(rpc: WebviewRpcClient): void {
  registerScreenshotAdapter({
    getViewportScreenOrigin: (cursorX, cursorY) =>
      rpc.request.getViewportScreenOrigin({ cursorX, cursorY }),

    captureScreenRegion: (options) => rpc.request.captureScreenRegion(options),
  });
}
