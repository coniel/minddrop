import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';

/**
 * Updates a property on a database design. The property is matched
 * by name; use `renameDesignProperty` to change the name.
 *
 * @param id - The ID of the design.
 * @param updatedProperty - The updated property schema.
 * @returns The updated design.
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the design is not a database design, the property does not exist, or its type was changed.
 */
export async function updateDesignProperty(
  id: string,
  updatedProperty: PropertySchema,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Only database designs carry a property schema
  if (design.type !== 'database') {
    throw new InvalidParameterError(
      `Cannot update a property on a ${design.type} design.`,
    );
  }

  // Find the property
  const property = design.properties.find(
    (existing) => existing.name === updatedProperty.name,
  );

  if (!property) {
    throw new InvalidParameterError(
      `Design ${id} has no property named ${updatedProperty.name}.`,
    );
  }

  // Prevent changing the property type
  if (property.type !== updatedProperty.type) {
    throw new InvalidParameterError(
      'Cannot update property type via updateDesignProperty.',
    );
  }

  // Replace the property and persist
  return updateDesign(id, {
    properties: design.properties.map((existing) =>
      existing.name === updatedProperty.name ? updatedProperty : existing,
    ),
  });
}
