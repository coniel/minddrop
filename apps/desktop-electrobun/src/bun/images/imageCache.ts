import { Utils } from 'electrobun/bun';
import fsp from 'node:fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileExists } from './fileExists';

// Extensions for which resized variants are generated. Gifs are
// excluded as they are usually animated, which a plain resize
// would flatten.
const RESIZABLE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif'];

// Cache size above which the oldest variants are pruned on startup
const MAX_CACHE_BYTES = 500 * 1024 * 1024;

const CACHE_DIR = `${Utils.paths.appData}/MindDrop/image-cache`;

// Generation promises keyed by cache filename, so concurrent
// requests for the same variant trigger a single resize
const inFlight = new Map<string, Promise<string | null>>();

/**
 * Returns the path of a cached variant of an image resized to the
 * given width, generating it if it does not yet exist.
 *
 * @param sourcePath - The absolute path of the source image.
 * @param width - The width to resize to, in pixels.
 * @returns The path of the resized variant, or null if the original should be used.
 */
export async function getResizedImage(
  sourcePath: string,
  width: number,
): Promise<string | null> {
  const extension = path.extname(sourcePath).toLowerCase();

  // Only resize the image types the resizer handles safely
  if (!RESIZABLE_EXTENSIONS.includes(extension)) {
    return null;
  }

  try {
    const stats = await fsp.stat(sourcePath);

    // Key the variant on the source path and its modification time so
    // that editing the source produces a fresh variant
    const cacheKey = Bun.hash(`${sourcePath}:${stats.mtimeMs}`).toString(16);
    const cacheFileName = `${cacheKey}-w${width}${extension}`;
    const cachePath = path.join(CACHE_DIR, cacheFileName);

    // Serve an already generated variant
    if (await fileExists(cachePath)) {
      return cachePath;
    }

    // Join an in-progress generation of the same variant
    const pending = inFlight.get(cacheFileName);

    if (pending) {
      return pending;
    }

    // Start the generation, clearing the in-flight entry once settled
    const generation = generateVariant(sourcePath, cachePath, width).finally(
      () => {
        inFlight.delete(cacheFileName);
      },
    );

    inFlight.set(cacheFileName, generation);

    return generation;
  } catch (error) {
    // Never let a caching failure break image rendering
    console.warn(`[imageCache] lookup failed for ${sourcePath}`, error);

    return null;
  }
}

/**
 * Deletes the oldest cached image variants until the cache directory
 * is back under its size limit.
 */
export async function pruneImageCache(): Promise<void> {
  try {
    const fileNames = await fsp.readdir(CACHE_DIR);

    // Collect each variant's size and modification time
    const files = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(CACHE_DIR, fileName);
        const stats = await fsp.stat(filePath);

        return { filePath, size: stats.size, mtimeMs: stats.mtimeMs };
      }),
    );

    let totalBytes = files.reduce((total, file) => total + file.size, 0);

    // Nothing to do while the cache is within its limit
    if (totalBytes <= MAX_CACHE_BYTES) {
      return;
    }

    // Delete oldest first until back under the limit
    const oldestFirst = files.sort((a, b) => a.mtimeMs - b.mtimeMs);

    for (const file of oldestFirst) {
      if (totalBytes <= MAX_CACHE_BYTES) {
        break;
      }

      await fsp.rm(file.filePath, { force: true });
      totalBytes -= file.size;
    }
  } catch {
    // The cache dir may not exist yet, in which case there is
    // nothing to prune
  }
}

/**
 * Writes a resized copy of the source image to the cache path.
 *
 * @param sourcePath - The absolute path of the source image.
 * @param cachePath - The path to write the variant to.
 * @param width - The width to resize to, in pixels.
 * @returns The cache path, or null if the original should be used.
 */
async function generateVariant(
  sourcePath: string,
  cachePath: string,
  width: number,
): Promise<string | null> {
  try {
    const metadata = await sharp(sourcePath).metadata();

    // Never upscale, the original is already small enough
    if (!metadata.width || metadata.width <= width) {
      return null;
    }

    // Multi-frame sources (e.g. animated webp) would be flattened
    // to their first frame by a plain resize
    if (metadata.pages && metadata.pages > 1) {
      return null;
    }

    await fsp.mkdir(CACHE_DIR, { recursive: true });

    // Write to a temporary path first so that a crash mid-write
    // cannot leave a truncated file in the cache
    const temporaryPath = `${cachePath}.tmp`;

    await sharp(sourcePath).resize({ width }).toFile(temporaryPath);
    await fsp.rename(temporaryPath, cachePath);

    return cachePath;
  } catch (error) {
    // Any resize failure falls back to the original image
    console.warn(`[imageCache] resize failed for ${sourcePath}`, error);

    return null;
  }
}
