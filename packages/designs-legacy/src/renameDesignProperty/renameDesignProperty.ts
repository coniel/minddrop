import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignPropertyRenamedEvent } from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';
import { remapLayoutPropertyBindings } from '../utils';

/**
 * Renames a property on a design and rebinds layout elements
 * bound to it.
 *
 * @param id - The ID of the design.
 * @param oldName - The current name of the property.
 * @param newName - The new name for the property.
 * @returns The updated design.
 *
 * @dispatches 'designs:property:renamed'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the property does not exist or the new name is already in use.
 */
export async function renameDesignProperty(
  id: string,
  oldName: string,
  newName: string,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Find the property
  const property = design.properties.find(
    (existing) => existing.name === oldName,
  );

  if (!property) {
    throw new InvalidParameterError(
      `Design ${id} has no property named ${oldName}.`,
    );
  }

  // Ensure the new name doesn't collide with another property
  if (
    oldName !== newName &&
    design.properties.some((existing) => existing.name === newName)
  ) {
    throw new InvalidParameterError(
      `Design ${id} already has a property named ${newName}.`,
    );
  }

  // Rename the property and rebind layout elements bound to it,
  // then persist
  const updated = await updateDesign(id, {
    properties: design.properties.map((existing) =>
      existing.name === oldName ? { ...existing, name: newName } : existing,
    ),
    layouts: remapLayoutPropertyBindings(design.layouts, oldName, newName),
  });

  // Dispatch a property renamed event
  Events.dispatch(DesignPropertyRenamedEvent, {
    design: updated,
    oldName,
    newName,
  });

  return updated;
}
