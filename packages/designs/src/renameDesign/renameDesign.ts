import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension } from '../constants';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { writeDesign } from '../writeDesign';

/**
 * Renames a design.
 *
 * @param id - The ID of the design to rename.
 * @param newName - The new name of the design.
 * @returns The updated design.
 *
 * @throws {PathConflictError} If the new path is already taken.
 */
export async function renameDesign(
  id: string,
  newName: string,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);
  // Generate the new path
  const newPath = Fs.concatPath(
    Fs.parentDirPath(design.path),
    `${newName}.${DesignFileExtension}`,
  );

  // If the name is unchanged, return the design as is
  if (newName === design.name) {
    return design;
  }

  // Ensure the new path is unique
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Rename the design file
  await Fs.rename(design.path, newPath);

  // Update the design name, path, and last modified date
  DesignsStore.update(design.id, {
    name: newName,
    path: newPath,
    lastModified: new Date(),
  });

  // Write the updated design to the file system
  await writeDesign(id);

  // Get the updated design
  const updatedDesign = getDesign(id);

  // Dispatch a design updated event
  Events.dispatch<DesignUpdatedEventData>(DesignUpdatedEvent, {
    original: design,
    updated: updatedDesign,
  });

  // Return the updated design
  return updatedDesign;
}
