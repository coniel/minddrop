import { useEffect, useState } from 'react';
import { getImageStats, peekImageStats } from '../getImageStats';
import { ImageStats } from '../types';

/**
 * Returns the brightness statistics of an image on the file system.
 *
 * Returns undefined while the image is being analysed, and null when
 * it could not be analysed or no path was given.
 *
 * @param path - The path to the image file.
 * @returns The image's stats, null, or undefined while analysing.
 */
export function useImageStats(
  path: string | null,
): ImageStats | null | undefined {
  // Initialize from the cache so that an already analysed image
  // resolves on its first render rather than after an effect
  const [stats, setStats] = useState(() => peekImageStats(path));

  useEffect(() => {
    const known = peekImageStats(path);

    // Adopt whatever is known about the new path, which also clears
    // stats belonging to the previous one
    setStats(known);

    // Already resolved, nothing to fetch
    if (!path || known !== undefined) {
      return;
    }

    let current = true;

    getImageStats(path).then((result) => {
      // Ignore a result which arrived after the path changed
      // or the component unmounted
      if (current) {
        setStats(result);
      }
    });

    return () => {
      current = false;
    };
  }, [path]);

  return stats;
}
