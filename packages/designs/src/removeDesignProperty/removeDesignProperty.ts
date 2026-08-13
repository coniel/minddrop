import { InvalidParameterError } from '@minddrop/utils';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';
import { remapLayoutPropertyBindings } from '../utils';

/**
 * Removes a property from a database design and unbinds layout
 * elements bound to it.
 *
 * @param id - The ID of the design to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the design is not a database design or the property does not exist.
 */
export async function removeDesignProperty(
  id: string,
  propertyName: string,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Only database designs carry a property schema
  if (design.type !== 'database') {
    throw new InvalidParameterError(
      `Cannot remove a property from a ${design.type} design.`,
    );
  }

  // Ensure the property exists
  if (!design.properties.some((existing) => existing.name === propertyName)) {
    throw new InvalidParameterError(
      `Design ${id} has no property named ${propertyName}.`,
    );
  }

  // Filter the property out, unbind layout elements bound to it,
  // then persist
  return updateDesign(id, {
    properties: design.properties.filter(
      (existing) => existing.name !== propertyName,
    ),
    layouts: remapLayoutPropertyBindings(design.layouts, propertyName, null),
  });
}
