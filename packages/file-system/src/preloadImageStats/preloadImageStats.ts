import { Paths } from '@minddrop/utils';
import { primeImageStatsCache } from '../getImageStats';
import { ImageStats } from '../types';

/**
 * Fetches every image analysis the file server holds and caches it,
 * so that already analysed images classify on their first render
 * rather than after a request each.
 */
export async function preloadImageStats(): Promise<void> {
  try {
    const response = await fetch(`${Paths.httpServerHost}/image-stats/all`);

    if (!response.ok) {
      throw new Error(`image stats preload failed: ${response.status}`);
    }

    const entries = (await response.json()) as Record<string, ImageStats>;

    primeImageStatsCache(entries);
  } catch {
    // Without a preload, images are analysed on demand as they render
  }
}
