import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';

/**
 * Adds a property to a database design.
 *
 * @param id - The ID of the design to add the property to.
 * @param property - The property to add.
 * @returns The updated design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the design is not a database design or a property with the same name already exists.
 */
export async function addDesignProperty(
  id: string,
  property: PropertySchema,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Only database designs carry a property schema
  if (design.type !== 'database') {
    throw new InvalidParameterError(
      `Cannot add a property to a ${design.type} design.`,
    );
  }

  // Ensure the property name is not already used
  if (design.properties.some((existing) => existing.name === property.name)) {
    throw new InvalidParameterError(
      `Design ${id} already has a property named ${property.name}.`,
    );
  }

  // Append the property and persist
  return updateDesign(id, {
    properties: [...design.properties, property],
  });
}
