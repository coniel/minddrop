export interface FontLetterBand {
  /**
   * The height from the top of the font's tallest letters to the
   * bottom of its lowest, as a share of the font size.
   */
  height: number;

  /**
   * How far a line must be lifted for the band to sit against the
   * line box's top edge, as a share of the font size. The line box
   * centres the font's full ascent to descent box, which keeps room
   * above the letters for accents, so the band sits low within it.
   */
  lift: number;
}

export interface FontLetterBandOptions {
  /**
   * The font family stack the text is drawn in.
   */
  fontFamily: string;

  /**
   * The weight the text is drawn at. Omitted, the regular weight.
   */
  fontWeight?: number;
}

/**
 * The band of a font which cannot be measured, taken from the
 * interface font.
 */
export const DefaultFontLetterBand: FontLetterBand = {
  height: 0.94,
  lift: 0.11,
};

// The letters a Latin font draws highest and lowest, whose bounds
// are the letters' band.
const ProbeLetters = 'bdfhklgjpqy';

// The size the probe is measured at, large enough for the metrics
// to be precise.
const ProbeFontSize = 100;

// The range a font's letter band falls in. A measurement outside it
// is not of the font asked for, e.g. one a canvas made at its own
// default size after refusing the font.
const MinBandHeight = 0.5;
const MaxBandHeight = 1.5;

// The bands measured so far, keyed by the font shorthand they were
// measured with. The theme's fonts are static, so entries never go
// stale within a session.
const measuredBands = new Map<string, FontLetterBand>();

/**
 * Resolves the band a font's letters occupy, by measuring the
 * letters which reach highest and lowest in it. Fonts are measured
 * once, subsequent calls reading the measurement back.
 *
 * @param options - The font to measure.
 * @returns The font's letter band.
 */
export function resolveFontLetterBand(
  options: FontLetterBandOptions,
): FontLetterBand {
  const { fontFamily, fontWeight = 400 } = options;

  // The font as a canvas font shorthand, doubling as its cache key
  const font = `${fontWeight} ${ProbeFontSize}px ${fontFamily}`;

  // Read back the band measured on an earlier call
  const measured = measuredBands.get(font);

  if (measured) {
    return measured;
  }

  const context = resolveMeasuringContext();

  if (!context) {
    return DefaultFontLetterBand;
  }

  const band = measureBand(context, fontWeight, fontFamily);

  // Hold off caching where the font could not be measured, so it is
  // measured again once it can be.
  if (!band) {
    return DefaultFontLetterBand;
  }

  measuredBands.set(font, band);

  return band;
}

/**
 * Measures a font's letter band, taking the first family of the
 * stack the canvas accepts. A canvas keeps its own font where the
 * shorthand does not parse, which the whole stack can fail to do.
 *
 * @param context - The context to measure on.
 * @param fontWeight - The weight the font is drawn at.
 * @param fontFamily - The font family stack the text is drawn in.
 * @returns The font's letter band, or null where it cannot be
 *   measured.
 */
function measureBand(
  context: CanvasRenderingContext2D,
  fontWeight: number,
  fontFamily: string,
): FontLetterBand | null {
  // The whole stack, then each of its families on its own
  const families = [fontFamily, ...fontFamily.split(',')];

  for (const family of families) {
    context.font = `${fontWeight} ${ProbeFontSize}px ${family.trim()}`;

    // Skip a font the canvas did not take, which leaves it measuring
    // at its own default size.
    if (!context.font.includes(`${ProbeFontSize}px`)) {
      continue;
    }

    const band = resolveBand(context.measureText(ProbeLetters));

    if (band) {
      return band;
    }
  }

  return null;
}

/**
 * Resolves a canvas context to measure a font on. Only fonts which
 * have not been measured before reach it, so the canvas is made per
 * measurement rather than kept.
 *
 * @returns The measuring context, or null where the engine has no
 *   canvas.
 */
function resolveMeasuringContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.createElement('canvas').getContext('2d');
}

/**
 * Resolves the letter band from a measured probe.
 *
 * @param metrics - The probe's text metrics.
 * @returns The letter band, or null where the metrics are missing.
 */
function resolveBand(metrics: TextMetrics): FontLetterBand | null {
  const {
    actualBoundingBoxAscent: letterAscent,
    actualBoundingBoxDescent: letterDescent,
    fontBoundingBoxAscent: fontAscent,
    fontBoundingBoxDescent: fontDescent,
  } = metrics;

  // Engines without glyph metrics leave them undefined
  if (!letterAscent || !letterDescent || !fontAscent || !fontDescent) {
    return null;
  }

  // The band the letters occupy
  const height = (letterAscent + letterDescent) / ProbeFontSize;

  // Turn down a measurement of another font than the one asked for
  if (height < MinBandHeight || height > MaxBandHeight) {
    return null;
  }

  // The band's top against the top of the line box, which holds the
  // font's ascent to descent box centred within it.
  const lift =
    height / 2 +
    (fontAscent - fontDescent) / (2 * ProbeFontSize) -
    letterAscent / ProbeFontSize;

  return { height, lift };
}
