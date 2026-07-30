import { Fs } from '@minddrop/file-system';
import { getDesign } from '../getDesign';
import { getDesignFilePath } from '../utils';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Write the design to the file system
  await Fs.writeJsonFile(getDesignFilePath(design.id), design);
}
