import { imageFile, textFile } from '@minddrop/test-utils';
import { GetImageDimensionsError } from '../errors';
import { getImageDimensions } from './getImageDimensions';

describe('getImageDimensions', () => {
  it('does something useful', async () => {
    const result = await getImageDimensions(imageFile);
    expect(result.height).toBe(256);
    expect(result.width).toBe(256);
    expect(result.aspectRatio).toBe(1);
  });

  it('throws a GetImageDimensionsError for invalid images', async () => {
    try {
      await getImageDimensions(textFile);
    } catch (err) {
      expect(err).toBeInstanceOf(GetImageDimensionsError);
    }
  });
});
