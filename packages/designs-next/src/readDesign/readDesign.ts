import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Design } from '../types';
import { validateDesign } from '../utils';

/**
 * Reads a design from its file, validating its shape and restoring
 * its date fields.
 *
 * @param filePath - The path to the design file.
 * @returns The design, or null if the file is not a valid design.
 */
export async function readDesign(filePath: string): Promise<Design | null> {
  let contents: unknown;

  try {
    // Read the design file
    contents = await Fs.readJsonFile<object>(filePath);
  } catch {
    // The design file is missing or not valid JSON
    return null;
  }

  // Discard files that are not valid designs
  if (!validateDesign(contents)) {
    return null;
  }

  // JSON leaves dates as ISO strings; restore them
  return restoreDates<Design>(contents);
}
