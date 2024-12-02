import { useEffect, useState } from 'react';
import { Fs } from '../FileSystem';

/**
 * Returns the `src` of an image on the file system, or null if
 * the image does not exist.
 *
 * @param path - The path to the image file.
 * @returns The src of the image or null if it does not exist.
 */
export function useImageSrc(path: string | null): string | null {
  const [src, setSrc] = useState(path ? Fs.convertFileSrc(path) : '');

  useEffect(() => {
    async function setSrcWhenReady(imagePath: string) {
      try {
        const imageSrc = await waitForImageToBeReady(imagePath);

        if (imageSrc) {
          setSrc(imageSrc.src);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (path) {
      setSrcWhenReady(path);
    }
  }, [path]);

  if (!src) {
    return null;
  }

  return src;
}

/**
 * Waits for an image file to be ready by repeatedly checking its availability.
 * @param filePath - The file path to the image.
 * @param maxRetries - Maximum number of retries before giving up.
 * @param retryDelay - Delay between retries in milliseconds.
 * @returns A promise that resolves when the image is ready or rejects if it fails.
 */
async function waitForImageToBeReady(
  filePath: string,
  maxRetries: number = 10,
  retryDelay: number = 100,
): Promise<HTMLImageElement> {
  const imageSrc = Fs.convertFileSrc(filePath);

  return new Promise((resolve, reject) => {
    let retries = 0;

    const img = new Image();

    const onLoad = () => {
      cleanUp();
      resolve(img);
    };

    const onError = () => {
      retries++;

      if (retries > maxRetries) {
        cleanUp();
        reject(new Error(`Image not ready after ${maxRetries} retries.`));
      } else {
        setTimeout(() => {
          img.src = `${imageSrc}?cacheBust=${Date.now()}`; // Cache-busting to force reload
        }, retryDelay);
      }
    };

    const cleanUp = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);

    // Initial attempt to load the image
    img.src = imageSrc;
  });
}
