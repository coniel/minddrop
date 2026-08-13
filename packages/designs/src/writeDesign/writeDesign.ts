import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getDesign } from '../getDesign';
import { resolveDesignBundleDirPath, resolveDesignFilePath } from '../utils';

/**
 * Writes a design to the file system.
 *
 * @param designId - The ID of the design to write.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the design is virtual.
 */
export async function writeDesign(designId: string): Promise<void> {
  // Get the design
  const design = getDesign(designId);

  // Virtual designs are persisted by their owner, never to a bundle
  if (design.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual design to the file system',
    );
  }

  // Ensure the design's bundle directory exists
  await Fs.ensureDir(resolveDesignBundleDirPath(design.id));

  // Write the design to the file system
  await Fs.writeJsonFile(resolveDesignFilePath(design.id), design);
}
