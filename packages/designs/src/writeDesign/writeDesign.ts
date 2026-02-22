import { Fs } from '@minddrop/file-system';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { defaultDesignIds } from '../default-designs';
import { getDesign } from '../getDesign';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Prevent writing default designs
  if (defaultDesignIds.includes(design.id)) {
    throw new InvalidParameterError(`Cannot write default design ${design.id}`);
  }

  // Write the design to the file system, omitting the path
  await Fs.writeJsonFile(design.path, omitPath(design));
}
