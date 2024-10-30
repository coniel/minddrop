import { useEffect, useCallback, useMemo, useState } from 'react';
import { Fs } from '../FileSystem';

/**
 * Returns the `src` of an image on the file system, or null if
 * the image does not exist.
 *
 * @param path - The path to the image file.
 * @returns The src of the image or null if it does not exist.
 */
export function useImageSrc(path: string): string | null {
  const [imageAvailable, setImageAvailable] = useState(true);
  const [loops, setLoops] = useState(0);
  const [keepTrying, setKeepTrying] = useState(true);
  const tester = useMemo(() => new Image(), []);

  const src = useMemo(() => Fs.convertFileSrc(path), [path]);

  const testImage = useCallback(async () => {
    if (keepTrying && !(await Fs.exists(path))) {
      setLoops((loops) => loops + 1);
      setTimeout(() => {
        testImage();
      }, 200);
    }
    tester.src = src;
  }, [src, tester, path, keepTrying]);

  const imageNotFound = useCallback(() => {
    setImageAvailable(false);
    setLoops((loops) => loops + 1);

    setTimeout(() => {
      testImage();
    }, 200);
  }, [testImage]);

  const imageFound = useCallback(() => {
    setImageAvailable(true);

    tester.removeEventListener('load', imageFound);
    tester.removeEventListener('error', imageNotFound);
  }, [imageNotFound, tester]);

  // When adding a new image, it occasionally takes a moment
  // for the image to be available. This effect checks if the
  // image is available. If not, it will try again after a
  // timeout.
  useEffect(() => {
    tester.addEventListener('load', imageFound);
    tester.addEventListener('error', imageNotFound);

    if (src) {
      testImage();
    }

    return () => {
      tester.removeEventListener('load', imageFound);
      tester.removeEventListener('error', imageNotFound);
    };
  }, [src, tester, imageFound, imageNotFound, testImage]);

  useEffect(() => {
    if (loops > 30) {
      setKeepTrying(false);
      tester.removeEventListener('load', imageFound);
      tester.removeEventListener('error', imageNotFound);
    }
  }, [loops, imageFound, imageNotFound, tester]);

  if (!src) {
    return null;
  }

  if (!imageAvailable) {
    return null;
  }

  return src;
}
