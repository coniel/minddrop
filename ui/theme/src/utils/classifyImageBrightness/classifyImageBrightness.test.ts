import { describe, expect, it } from 'vitest';
import { ImageStats } from '@minddrop/file-system';
import { classifyImageBrightness } from './classifyImageBrightness';

// Base stats spread into each case, so that a case states only the
// measurements it is about
const stats: ImageStats = {
  brightFraction: 0,
  nearWhiteFraction: 0,
  averageColor: '#808080',
};

describe('classifyImageBrightness', () => {
  it('leaves an unanalysed image unclassified', () => {
    // Classify an image with no stats
    expect(classifyImageBrightness(null)).toEqual({
      bright: false,
      lightBackground: false,
    });
  });

  it('classifies a mostly bright image as bright', () => {
    // Classify an image which is bright throughout
    const { bright } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.8,
      nearWhiteFraction: 0,
    });

    expect(bright).toBe(true);
  });

  it('classifies a mostly dark image with a bright patch as bright', () => {
    // Classify a dark image whose bright area still glares
    const { bright } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.2,
      nearWhiteFraction: 0,
    });

    expect(bright).toBe(true);
  });

  it('does not classify a dark image as bright', () => {
    // Classify an image with almost no bright area
    const { bright } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.01,
      nearWhiteFraction: 0,
    });

    expect(bright).toBe(false);
  });

  it('does not classify an image at the bright threshold as bright', () => {
    // Classify an image exactly at the bright fraction threshold
    const { bright } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.06,
      nearWhiteFraction: 0,
    });

    expect(bright).toBe(false);
  });

  it('classifies a mostly white image as light background', () => {
    // Classify an image well above the near white threshold
    const { lightBackground } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.9,
      nearWhiteFraction: 0.8,
    });

    expect(lightBackground).toBe(true);
  });

  it('does not classify an image with few white pixels as light background', () => {
    // Classify an image well below the near white threshold
    const { lightBackground } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.2,
      nearWhiteFraction: 0.1,
    });

    expect(lightBackground).toBe(false);
  });

  it('does not classify an image at the near white threshold as light background', () => {
    // Classify an image exactly at the near white threshold
    const { lightBackground } = classifyImageBrightness({
      ...stats,
      brightFraction: 0.5,
      nearWhiteFraction: 0.4,
    });

    expect(lightBackground).toBe(false);
  });

  it('classifies an image as both bright and light background', () => {
    // Classify a white background screenshot, which is above
    // both thresholds
    expect(
      classifyImageBrightness({
        ...stats,
        brightFraction: 0.85,
        nearWhiteFraction: 0.75,
      }),
    ).toEqual({ bright: true, lightBackground: true });
  });
});
