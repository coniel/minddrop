import { Fs } from '@minddrop/file-system';
import { getDesignsDirPath } from './getDesignsDirPath';

export const PlaceholderMediaDirName = 'placeholder-media';

/**
 * Returns the path to the placeholder media directory
 * inside the designs directory.
 *
 * @returns The path to the placeholder media directory.
 */
export function getPlaceholderMediaDirPath(): string {
  return Fs.concatPath(getDesignsDirPath(), PlaceholderMediaDirName);
}
