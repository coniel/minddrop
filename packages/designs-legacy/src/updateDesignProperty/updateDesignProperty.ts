import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import {
  DesignPropertyUpdatedEvent,
  DesignPropertyUpdatedEventData,
} from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';

/**
 * Updates a property on a design. The property is matched by
 * name; use `renameDesignProperty` to change the name.
 *
 * @param id - The ID of the design.
 * @param updatedProperty - The updated property schema.
 * @returns The updated design.
 *
 * @dispatches 'designs:property:updated'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the property does not exist or its type was changed.
 */
export async function updateDesignProperty(
  id: string,
  updatedProperty: PropertySchema,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

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
  const updated = await updateDesign(id, {
    properties: design.properties.map((existing) =>
      existing.name === updatedProperty.name ? updatedProperty : existing,
    ),
  });

  // Dispatch a property updated event
  Events.dispatch<DesignPropertyUpdatedEventData>(DesignPropertyUpdatedEvent, {
    design: updated,
    property: updatedProperty,
  });

  return updated;
}
