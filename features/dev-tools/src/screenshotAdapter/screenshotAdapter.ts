import { ScreenshotAdapter } from '../types';

let screenshotAdapter: ScreenshotAdapter | null = null;

/**
 * Registers the screenshot adapter, enabling the screenshot picker.
 * Platforms which cannot capture the screen leave it unregistered.
 *
 * @param adapter - A screenshot adapter.
 */
export function registerScreenshotAdapter(adapter: ScreenshotAdapter): void {
  screenshotAdapter = adapter;
}

/**
 * **Intended for use in tests only.**
 *
 * Unregisters the screenshot adapter.
 */
export function unregisterScreenshotAdapter(): void {
  screenshotAdapter = null;
}

/**
 * Returns the registered screenshot adapter, or null when the
 * platform did not register one.
 */
export function getScreenshotAdapter(): ScreenshotAdapter | null {
  return screenshotAdapter;
}
