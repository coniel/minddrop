import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Paths } from '@minddrop/utils';
import { ImageStats } from '../types';
import {
  clearImageStatsCache,
  getImageStats,
  peekImageStats,
  primeImageStatsCache,
} from './getImageStats';

const IMAGE_PATH = '/workspace/images/photo.png';
const STATS: ImageStats = {
  brightFraction: 0.8,
  nearWhiteFraction: 0.6,
  averageColor: '#c8c8c8',
  width: 1200,
  height: 800,
};

// Requested URLs, used to verify that repeated lookups of the same
// image result in a single request
let requestedUrls: string[] = [];

describe('getImageStats', () => {
  beforeEach(() => {
    Paths.httpServerHost = 'http://localhost:1234';
    requestedUrls = [];

    // Stand in for the file server, which analyses the image
    vi.stubGlobal('fetch', (url: string) => {
      requestedUrls.push(url);

      return Promise.resolve(
        new Response(JSON.stringify(STATS), { status: 200 }),
      );
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearImageStatsCache();
    Paths.httpServerHost = '';
  });

  it('returns the stats of the image', async () => {
    // Fetch the stats of an image
    const stats = await getImageStats(IMAGE_PATH);

    // Should return the stats served by the file server
    expect(stats).toEqual(STATS);
  });

  it('requests the image stats from the file server', async () => {
    // Fetch the stats of an image
    await getImageStats(IMAGE_PATH);

    // Should request the path from the file server's stats endpoint
    expect(requestedUrls).toEqual([
      `http://localhost:1234/image-stats?path=${encodeURIComponent(IMAGE_PATH)}`,
    ]);
  });

  it('fetches the stats of an image only once', async () => {
    // Fetch the stats of the same image twice in sequence
    await getImageStats(IMAGE_PATH);
    await getImageStats(IMAGE_PATH);

    // Should have made a single request
    expect(requestedUrls.length).toBe(1);
  });

  it('shares a single request between simultaneous lookups', async () => {
    // Fetch the stats of the same image twice simultaneously
    const [first, second] = await Promise.all([
      getImageStats(IMAGE_PATH),
      getImageStats(IMAGE_PATH),
    ]);

    // Should have made a single request, resolving both lookups
    expect(requestedUrls.length).toBe(1);
    expect(first).toEqual(STATS);
    expect(second).toEqual(STATS);
  });

  it('returns null when the image could not be analysed', async () => {
    // Stand in for the file server responding that the image
    // could not be analysed
    vi.stubGlobal('fetch', () =>
      Promise.resolve(new Response('null', { status: 200 })),
    );

    // Fetch the stats of an image
    const stats = await getImageStats(IMAGE_PATH);

    // Should return null
    expect(stats).toBeNull();
  });

  it('peeks undefined for an image which has not been analysed', () => {
    // Peek at an image which has not been fetched
    expect(peekImageStats(IMAGE_PATH)).toBeUndefined();
  });

  it('peeks the stats of an already analysed image', async () => {
    // Fetch the stats of an image
    await getImageStats(IMAGE_PATH);

    // Should return the resolved stats without fetching again
    expect(peekImageStats(IMAGE_PATH)).toEqual(STATS);
    expect(requestedUrls.length).toBe(1);
  });

  it('peeks null when there is no path', () => {
    // Peek without a path, which is a resolved state rather than
    // a pending one
    expect(peekImageStats(null)).toBeNull();
  });

  it('serves primed stats without a request', async () => {
    // Prime the cache as the preload does
    primeImageStatsCache({ [IMAGE_PATH]: STATS });

    // Should return the primed stats
    expect(peekImageStats(IMAGE_PATH)).toEqual(STATS);
    expect(await getImageStats(IMAGE_PATH)).toEqual(STATS);

    // Should not have hit the file server
    expect(requestedUrls.length).toBe(0);
  });

  it('returns null when the request fails', async () => {
    // Stand in for an unreachable file server
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')));

    // Fetch the stats of an image
    const stats = await getImageStats(IMAGE_PATH);

    // Should return null
    expect(stats).toBeNull();
  });
});
