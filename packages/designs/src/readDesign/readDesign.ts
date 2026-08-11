import { Fs } from '@minddrop/file-system';
import { DesignFileName } from '../constants';
import { Design } from '../types';

/**
 * Reads a design from its bundle directory.
 *
 * @param bundleDirPath - The path to the design bundle directory.
 * @returns The design, or null if the directory is not a design bundle.
 */
export async function readDesign(
  bundleDirPath: string,
): Promise<Design | null> {
  try {
    // Read the design from its bundle directory
    const design = await Fs.readJsonFile<Design>(
      Fs.concatPath(bundleDirPath, DesignFileName),
    );

    return design;
  } catch {
    // The design file is missing or invalid
    return null;
  }
}
