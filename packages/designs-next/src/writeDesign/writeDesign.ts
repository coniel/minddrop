import { Fs } from '@minddrop/file-system';
import { getDesign } from '../getDesign';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Ensure the designs directory exists
  await Fs.ensureDir(resolveDesignsDirPath());

  // Write the design to the file system
  await Fs.writeJsonFile(resolveDesignFilePath(design.id), design);
}
