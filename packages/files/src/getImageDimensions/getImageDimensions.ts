import { GetImageDimensionsError } from '../errors';
import { ImageDimensions } from '../types';

/**
 * Returns an image file's dimensions, including the apsect ratio.
 *
 * @param file The image file.
 * @returns Image dimensions.
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>): void => {
      if (!event.target || typeof event.target.result !== 'string') {
        return;
      }
      const image = new Image();

      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height,
          aspectRatio: image.width / image.height || 1,
        });
      };

      image.onerror = () => {
        reject(new GetImageDimensionsError());
      };

      image.crossOrigin = 'anonymous';
      image.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}
