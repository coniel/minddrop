import { Paths } from '@minddrop/utils';
import { ImageStats } from '../types';

// Resolved analyses keyed by image path, so an image is only ever
// fetched once per session
const cache = new Map<string, ImageStats | null>();

// Requests in progress keyed by image path, so simultaneous lookups
// of the same image share a single request
const inFlight = new Map<string, Promise<ImageStats | null>>();

/**
 * Fetches the brightness statistics of an image on the file system.
 *
 * @param path - The path to the image file.
 * @returns The image's stats, or null if it could not be analysed.
 */
export function getImageStats(path: string): Promise<ImageStats | null> {
  // Serve an already resolved analysis
  const cached = cache.get(path);

  if (cached !== undefined) {
    return Promise.resolve(cached);
  }

  // Join an in-progress request for the same image
  const pending = inFlight.get(path);

  if (pending) {
    return pending;
  }

  // Start the request, clearing the in-flight entry once settled
  const request = fetchImageStats(path).finally(() => {
    inFlight.delete(path);
  });

  inFlight.set(path, request);

  return request;
}

/**
 * Returns an image's already fetched stats without fetching them,
 * or undefined if the image has not been analysed yet.
 *
 * @param path - The path to the image file.
 * @returns The image's stats, null if it could not be analysed, or undefined if not yet analysed.
 */
export function peekImageStats(
  path: string | null,
): ImageStats | null | undefined {
  // Nothing to analyse, which is a resolved state rather than a
  // pending one
  if (!path) {
    return null;
  }

  return cache.get(path);
}

/**
 * Adds already resolved stats to the cache, so that the images they
 * describe classify without a request.
 *
 * @param entries - Stats keyed by image path.
 */
export function primeImageStatsCache(
  entries: Record<string, ImageStats>,
): void {
  Object.entries(entries).forEach(([path, stats]) => {
    cache.set(path, stats);
  });
}

/**
 * Clears the cached image stats.
 */
export function clearImageStatsCache(): void {
  cache.clear();
  inFlight.clear();
}

/**
 * Requests an image's stats from the file server.
 *
 * @param path - The path to the image file.
 * @returns The image's stats, or null if it could not be analysed.
 */
async function fetchImageStats(path: string): Promise<ImageStats | null> {
  try {
    const response = await fetch(
      `${Paths.httpServerHost}/image-stats?path=${encodeURIComponent(path)}`,
    );

    if (!response.ok) {
      throw new Error(`image stats request failed: ${response.status}`);
    }

    const stats = (await response.json()) as ImageStats | null;

    cache.set(path, stats);

    return stats;
  } catch {
    // Without a running file server, or for an image the server
    // could not analyse, the image simply goes unclassified
    cache.set(path, null);

    return null;
  }
}
