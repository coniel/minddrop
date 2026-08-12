import { Utils } from 'electrobun/bun';
import fsp from 'node:fs/promises';
import sharp from 'sharp';
import type { ImageStats } from '@minddrop/file-system';

// Edge length of the downscale the analysis runs on. 64x64 is 4096
// samples, fine enough to register a small bright patch without the
// surrounding dark pixels averaging it away.
const ANALYSIS_SIZE = 64;

// Luminance above which a pixel counts as bright
const BRIGHT_LUMINANCE = 0.7;

// Luminance above which a pixel counts as near white
const NEAR_WHITE_LUMINANCE = 0.85;

// Kept outside the image cache directory so that pruning resized
// variants can never delete the analysis index
const STATS_FILE_PATH = `${Utils.paths.appData}/MindDrop/image-stats.json`;

// Delay before persisting, so that a burst of first time analyses
// results in a single write
const SAVE_DEBOUNCE_MS = 1000;

interface StoredImageStats extends ImageStats {
  /**
   * The source image's modification time when it was analysed.
   */
  mtimeMs: number;
}

// Analyses keyed by source image path, held in memory for the
// lifetime of the process and persisted as a single index file
const analyses = new Map<string, StoredImageStats>();

// Analyses in progress keyed by source path, so concurrent requests
// for the same image trigger a single analysis
const inFlight = new Map<string, Promise<ImageStats | null>>();

let saveTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Loads the persisted image analyses and discards those whose source
 * image has since been deleted or modified.
 */
export async function initializeImageStats(): Promise<void> {
  await loadAnalyses();
  await discardStaleAnalyses();
}

/**
 * Returns brightness statistics for an image, analysing it if it has
 * not been analysed since it last changed.
 *
 * @param sourcePath - The absolute path of the source image.
 * @returns The image's stats, or null if it could not be analysed.
 */
export async function getImageStats(
  sourcePath: string,
): Promise<ImageStats | null> {
  try {
    const fileStats = await fsp.stat(sourcePath);
    const stored = analyses.get(sourcePath);

    // Serve an analysis made since the image last changed
    if (stored && stored.mtimeMs === fileStats.mtimeMs) {
      return toImageStats(stored);
    }

    // Join an in-progress analysis of the same image
    const pending = inFlight.get(sourcePath);

    if (pending) {
      return pending;
    }

    // Start the analysis, clearing the in-flight entry once settled
    const analysis = analyzeAndStore(sourcePath, fileStats.mtimeMs).finally(
      () => {
        inFlight.delete(sourcePath);
      },
    );

    inFlight.set(sourcePath, analysis);

    return analysis;
  } catch (error) {
    // Never let an analysis failure break image rendering
    console.warn(`[imageStats] lookup failed for ${sourcePath}`, error);

    return null;
  }
}

/**
 * Returns every known image analysis, keyed by source image path, so
 * that the client can populate its cache in one request.
 */
export function getAllImageStats(): Record<string, ImageStats> {
  const all: Record<string, ImageStats> = {};

  analyses.forEach((stored, sourcePath) => {
    all[sourcePath] = toImageStats(stored);
  });

  return all;
}

/**
 * Reads the persisted analyses into memory.
 */
async function loadAnalyses(): Promise<void> {
  try {
    const contents = await fsp.readFile(STATS_FILE_PATH, 'utf8');
    const parsed: unknown = JSON.parse(contents);

    if (typeof parsed !== 'object' || parsed === null) {
      return;
    }

    // Skip anything not matching the current shape, so that an index
    // written by an older set of measurements is replaced rather than
    // read back with missing values
    Object.entries(parsed).forEach(([sourcePath, value]) => {
      if (isStoredImageStats(value)) {
        analyses.set(sourcePath, value);
      }
    });
  } catch {
    // No index yet, or an unreadable one, starts from empty
  }
}

/**
 * Drops analyses whose source image no longer exists or has been
 * modified since it was analysed.
 */
async function discardStaleAnalyses(): Promise<void> {
  const sourcePaths = Array.from(analyses.keys());

  // A single stat answers both whether the image still exists and
  // whether it has changed
  const staleness = await Promise.all(
    sourcePaths.map(async (sourcePath) => {
      try {
        const fileStats = await fsp.stat(sourcePath);

        return fileStats.mtimeMs !== analyses.get(sourcePath)?.mtimeMs;
      } catch {
        return true;
      }
    }),
  );

  const stalePaths = sourcePaths.filter((_, index) => staleness[index]);

  // Nothing to drop, so the index on disk is already correct
  if (!stalePaths.length) {
    return;
  }

  stalePaths.forEach((sourcePath) => {
    analyses.delete(sourcePath);
  });

  await saveAnalyses();
}

/**
 * Analyses an image and records the result against its modification
 * time.
 *
 * @param sourcePath - The absolute path of the source image.
 * @param mtimeMs - The image's modification time.
 * @returns The image's stats, or null if it could not be analysed.
 */
async function analyzeAndStore(
  sourcePath: string,
  mtimeMs: number,
): Promise<ImageStats | null> {
  const stats = await analyzeImage(sourcePath);

  // Unanalysable images are not recorded, and retrying them on each
  // request is cheap enough not to warrant it
  if (!stats) {
    return null;
  }

  analyses.set(sourcePath, { ...stats, mtimeMs });
  scheduleSave();

  return stats;
}

/**
 * Measures how much of an image is bright and how much is near white.
 *
 * @param sourcePath - The absolute path of the source image.
 * @returns The image's stats, or null if it could not be decoded.
 */
async function analyzeImage(sourcePath: string): Promise<ImageStats | null> {
  try {
    const dimensions = await readDimensions(sourcePath);

    const { data, info } = await sharp(sourcePath)
      .resize(ANALYSIS_SIZE, ANALYSIS_SIZE, { fit: 'fill' })
      // Composite onto white so that transparent images are classified
      // by their visible content rather than their transparent pixels
      .flatten({ background: '#ffffff' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { channels } = info;
    const pixelCount = data.length / channels;

    // An empty decode has nothing to measure
    if (!pixelCount) {
      return null;
    }

    let brightCount = 0;
    let nearWhiteCount = 0;
    let redTotal = 0;
    let greenTotal = 0;
    let blueTotal = 0;

    // Measure each pixel's brightness band and colour contribution
    for (let index = 0; index < data.length; index += channels) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

      redTotal += red;
      greenTotal += green;
      blueTotal += blue;

      // Track how much of the image is bright
      if (luminance > BRIGHT_LUMINANCE) {
        brightCount += 1;
      }

      // Track how much of the image is near white
      if (luminance > NEAR_WHITE_LUMINANCE) {
        nearWhiteCount += 1;
      }
    }

    return {
      brightFraction: brightCount / pixelCount,
      nearWhiteFraction: nearWhiteCount / pixelCount,
      averageColor: toHexColor(
        redTotal / pixelCount,
        greenTotal / pixelCount,
        blueTotal / pixelCount,
      ),
      ...dimensions,
    };
  } catch (error) {
    // Unsupported or malformed images simply go unclassified
    console.warn(`[imageStats] analysis failed for ${sourcePath}`, error);

    return null;
  }
}

/**
 * Reads an image's intrinsic dimensions as they are displayed.
 *
 * @param sourcePath - The absolute path of the source image.
 * @returns The image's width and height, empty if they could not be read.
 */
async function readDimensions(
  sourcePath: string,
): Promise<{ width?: number; height?: number }> {
  try {
    const { width, height, orientation } = await sharp(sourcePath).metadata();

    if (!width || !height) {
      return {};
    }

    // EXIF orientations of 5 and above rotate the image a quarter
    // turn, so the stored dimensions are displayed swapped
    if (orientation && orientation >= 5) {
      return { width: height, height: width };
    }

    return { width, height };
  } catch {
    // Dimensions are supplementary, so an unreadable header still
    // leaves the brightness measurements usable
    return {};
  }
}

/**
 * Formats averaged colour channels as a hex colour string.
 */
function toHexColor(red: number, green: number, blue: number): string {
  const channel = (value: number) =>
    Math.round(value).toString(16).padStart(2, '0');

  return `#${channel(red)}${channel(green)}${channel(blue)}`;
}

/**
 * Queues a write of the analysis index, replacing any queued write.
 */
function scheduleSave(): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveAnalyses();
  }, SAVE_DEBOUNCE_MS);
}

/**
 * Writes the analysis index to disk.
 */
async function saveAnalyses(): Promise<void> {
  try {
    await fsp.mkdir(`${Utils.paths.appData}/MindDrop`, { recursive: true });

    // Write to a temporary path first so that a crash mid-write
    // cannot leave a truncated index
    const temporaryPath = `${STATS_FILE_PATH}.tmp`;

    await fsp.writeFile(
      temporaryPath,
      JSON.stringify(Object.fromEntries(analyses)),
    );
    await fsp.rename(temporaryPath, STATS_FILE_PATH);
  } catch (error) {
    // The in-memory analyses stand even if they could not be persisted
    console.warn('[imageStats] index write failed', error);
  }
}

/**
 * Strips the stored modification time, leaving the stats themselves.
 */
function toImageStats({
  mtimeMs: _mtimeMs,
  ...stats
}: StoredImageStats): ImageStats {
  return stats;
}

/**
 * Checks whether a parsed index entry holds a complete analysis.
 */
function isStoredImageStats(value: unknown): value is StoredImageStats {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { brightFraction, nearWhiteFraction, averageColor, mtimeMs } =
    value as Record<string, unknown>;

  return (
    typeof brightFraction === 'number' &&
    typeof nearWhiteFraction === 'number' &&
    typeof averageColor === 'string' &&
    typeof mtimeMs === 'number'
  );
}
