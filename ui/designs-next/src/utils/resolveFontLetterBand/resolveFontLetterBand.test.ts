import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DefaultFontLetterBand,
  resolveFontLetterBand,
} from './resolveFontLetterBand';

// The bounds of the probe letters at a font size of one pixel, in a
// font whose letters reach 0.73 above the baseline and 0.21 below
// it, its ascent and descent keeping room for accents above them.
const ProbeBounds = {
  actualBoundingBoxAscent: 0.73,
  actualBoundingBoxDescent: 0.21,
  fontBoundingBoxAscent: 0.952,
  fontBoundingBoxDescent: 0.213,
};

// The font a canvas measures with until it is given one it can
// parse.
const DefaultCanvasFont = '10px sans-serif';

// Stubs the canvas measurement, jsdom laying nothing out: the stub
// measures the font it holds, and like a browser's canvas keeps its
// own default font where the shorthand it is given does not parse,
// which fonts naming the rejected family do not.
function stubMeasurement(rejectedFamily?: string, measuredSize?: number): void {
  let canvasFont = DefaultCanvasFont;

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    get font() {
      return canvasFont;
    },
    set font(value: string) {
      if (!rejectedFamily || !value.includes(rejectedFamily)) {
        canvasFont = value;
      }
    },
    measureText: () =>
      measureAt(measuredSize ? `${measuredSize}px` : canvasFont),
  } as unknown as CanvasRenderingContext2D);
}

/**
 * Measures the probe letters at the size a canvas font draws at.
 */
function measureAt(font: string): TextMetrics {
  const fontSize = Number(font.match(/([\d.]+)px/)?.[1] ?? 0);

  return Object.fromEntries(
    Object.entries(ProbeBounds).map(([bound, share]) => [
      bound,
      share * fontSize,
    ]),
  ) as unknown as TextMetrics;
}

describe('resolveFontLetterBand', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to the default band when the font cannot be measured', () => {
    expect(resolveFontLetterBand({ fontFamily: 'Unmeasurable' })).toEqual(
      DefaultFontLetterBand,
    );
  });

  it('falls back to the default band when the canvas takes no font', () => {
    stubMeasurement('Rejected');

    expect(resolveFontLetterBand({ fontFamily: 'Rejected' })).toEqual(
      DefaultFontLetterBand,
    );
  });

  it('falls back to the default band when the measurement is of another size', () => {
    // A canvas which takes the font but measures at another size,
    // as one refusing a font silently does
    stubMeasurement(undefined, 10);

    expect(resolveFontLetterBand({ fontFamily: 'Mismeasured' })).toEqual(
      DefaultFontLetterBand,
    );
  });

  it('measures the first family of the stack the canvas takes', () => {
    stubMeasurement('Rejected');

    const band = resolveFontLetterBand({ fontFamily: 'Rejected, Measurable' });

    expect(band.height).toBeCloseTo(0.94, 10);
  });

  it("measures the band the font's letters occupy", () => {
    stubMeasurement();

    const band = resolveFontLetterBand({ fontFamily: 'Measured' });

    // The letters' band, from the top of the tallest to the bottom
    // of the lowest.
    expect(band.height).toBeCloseTo(0.94, 10);

    // The distance the band sits below the line box's top edge
    expect(band.lift).toBeCloseTo(0.1095, 10);
  });

  it('reads a measured font back rather than measuring it again', () => {
    stubMeasurement();

    const band = resolveFontLetterBand({ fontFamily: 'Remembered' });

    // Take the measurement away, leaving the font unmeasurable
    vi.restoreAllMocks();

    expect(resolveFontLetterBand({ fontFamily: 'Remembered' })).toEqual(band);
  });

  it('measures each weight of a font separately', () => {
    stubMeasurement();

    resolveFontLetterBand({ fontFamily: 'Weighted', fontWeight: 400 });

    // Take the measurement away, leaving unmeasured fonts falling
    // back to the default band.
    vi.restoreAllMocks();

    expect(
      resolveFontLetterBand({ fontFamily: 'Weighted', fontWeight: 700 }),
    ).toEqual(DefaultFontLetterBand);
  });
});
