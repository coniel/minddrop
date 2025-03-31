import { Fs } from '@minddrop/file-system';
import { CollectionsConfigDir, CollectionsConfigFileName } from '../constants';

/**
 * Checks if the collection's config file exists.
 *
 * @returns boolean indicating whether the file exists.
 */
export async function hasCollectionsConfig(): Promise<boolean> {
  // Check if collection configs file exists
  return Fs.exists(CollectionsConfigFileName, {
    baseDir: CollectionsConfigDir,
  });
}
