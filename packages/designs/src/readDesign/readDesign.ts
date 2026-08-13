import { Fs } from '@minddrop/file-system';
import { DesignFileName } from '../constants';
import { Design } from '../types';
import { reviveDesignDates, validateDesign } from '../utils';

/**
 * Reads a design from its bundle directory, validating its shape
 * and reviving its date fields.
 *
 * @param bundleDirPath - The path to the design bundle directory.
 * @returns The design, or null if the directory is not a valid design bundle.
 */
export async function readDesign(
  bundleDirPath: string,
): Promise<Design | null> {
  let contents: unknown;

  try {
    // Read the design file from its bundle directory
    contents = await Fs.readJsonFile<object>(
      Fs.concatPath(bundleDirPath, DesignFileName),
    );
  } catch {
    // The design file is missing or not valid JSON
    return null;
  }

  // Discard files that are not valid designs
  if (!validateDesign(contents)) {
    return null;
  }

  // JSON leaves dates as ISO strings; revive them
  return reviveDesignDates(contents);
}
