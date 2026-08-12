export interface ImageStats {
  /**
   * The fraction of the image's pixels which are bright, from 0 to 1.
   * Measures how much bright area the image has rather than how
   * bright it is on average, as a dark image with a bright patch
   * still glares in dark mode.
   */
  brightFraction: number;

  /**
   * The fraction of the image's pixels which are near white, from 0
   * to 1. High values indicate a light background, as found in
   * screenshots, diagrams, and logos.
   */
  nearWhiteFraction: number;

  /**
   * The image's mean colour as a hex string, used to fill the space
   * an image will occupy while it loads.
   */
  averageColor: string;

  /**
   * The image's intrinsic width in pixels, as displayed, or undefined
   * if it could not be read.
   */
  width?: number;

  /**
   * The image's intrinsic height in pixels, as displayed, or
   * undefined if it could not be read.
   */
  height?: number;
}
