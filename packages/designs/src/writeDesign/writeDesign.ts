import { Fs } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { getDesign } from '../getDesign';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Write the design to the file system, omitting the path
  await Fs.writeJsonFile(design.path, omitPath(design));
}
