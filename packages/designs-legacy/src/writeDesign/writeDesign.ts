import { Fs } from '@minddrop/file-system';
import { getDesign } from '../getDesign';
import { resolveDesignBundleDirPath, resolveDesignFilePath } from '../utils';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Ensure the design's bundle directory exists
  await Fs.ensureDir(resolveDesignBundleDirPath(design.id));

  // Write the design to the file system
  await Fs.writeJsonFile(resolveDesignFilePath(design.id), design);
}
