import { describe, expect, it } from 'vitest';
import { ImageStats } from '@minddrop/file-system';
import { createImagePlaceholderStyle } from './createImagePlaceholderStyle';

const stats: ImageStats = {
  brightFraction: 0.3,
  nearWhiteFraction: 0.1,
  averageColor: '#4a5b6c',
  width: 1600,
  height: 900,
};

describe('createImagePlaceholderStyle', () => {
  it('returns no styles when the image is not analysed', () => {
    // Create styles without stats
    expect(createImagePlaceholderStyle(null, false)).toEqual({});
    expect(createImagePlaceholderStyle(undefined, false)).toEqual({});
  });

  it('reserves the image space and fills it before loading', () => {
    // Create styles for an image which has not loaded
    expect(createImagePlaceholderStyle(stats, false)).toEqual({
      aspectRatio: '1600 / 900',
      backgroundColor: '#4a5b6c',
    });
  });

  it('drops the fill once the image has loaded', () => {
    // Create styles for a loaded image, whose transparent areas
    // would otherwise show the fill
    expect(createImagePlaceholderStyle(stats, true)).toEqual({
      aspectRatio: '1600 / 900',
    });
  });

  it('omits the aspect ratio when the dimensions are unknown', () => {
    // Create styles for an image whose header could not be read
    const { width: _width, height: _height, ...withoutSize } = stats;

    expect(createImagePlaceholderStyle(withoutSize, false)).toEqual({
      backgroundColor: '#4a5b6c',
    });
  });
});
