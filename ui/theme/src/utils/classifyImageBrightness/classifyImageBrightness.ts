import { ImageStats } from '@minddrop/file-system';

// Bright pixel fraction above which an image counts as bright. Kept
// low because a bright patch glares in dark mode even when the rest
// of the image is dark.
const BRIGHT_FRACTION_THRESHOLD = 0.06;

// Near white pixel fraction above which an image counts as having a
// light background
const LIGHT_BACKGROUND_FRACTION_THRESHOLD = 0.4;

export interface ImageBrightnessClassification {
  /**
   * Whether the image has enough bright area to glare in dark mode.
   */
  bright: boolean;

  /**
   * Whether the image is mostly light background, as found in
   * screenshots, diagrams, and logos.
   */
  lightBackground: boolean;
}

/**
 * Classifies an image's brightness from its statistics.
 *
 * @param stats - The image's statistics, or null if unavailable.
 * @returns The image's brightness classification.
 */
export function classifyImageBrightness(
  stats: ImageStats | null,
): ImageBrightnessClassification {
  // An unanalysed image is left unclassified
  if (!stats) {
    return { bright: false, lightBackground: false };
  }

  return {
    bright: stats.brightFraction > BRIGHT_FRACTION_THRESHOLD,
    lightBackground:
      stats.nearWhiteFraction > LIGHT_BACKGROUND_FRACTION_THRESHOLD,
  };
}
