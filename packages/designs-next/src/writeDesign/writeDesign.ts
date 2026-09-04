import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDesign } from '../getDesign';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the design is owned.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Owned designs have no design file
  if (design.owner) {
    throw new InvalidParameterError(
      `Cannot write owned design ${designId} to the file system`,
    );
  }

  // Ensure the designs directory exists
  await Fs.ensureDir(resolveDesignsDirPath());

  // Write the design to the file system
  await Fs.writeJsonFile(resolveDesignFilePath(design.id), design);
}
