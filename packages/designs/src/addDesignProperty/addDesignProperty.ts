import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import {
  DesignPropertyAddedEvent,
  DesignPropertyAddedEventData,
} from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';

/**
 * Adds a property to a design.
 *
 * @param id - The ID of the design to add the property to.
 * @param property - The property to add.
 * @returns The updated design.
 *
 * @dispatches 'designs:property:added'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If a property with the same name already exists.
 */
export async function addDesignProperty(
  id: string,
  property: PropertySchema,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Ensure the property name is not already used
  if (design.properties.some((existing) => existing.name === property.name)) {
    throw new InvalidParameterError(
      `Design ${id} already has a property named ${property.name}.`,
    );
  }

  // Append the property and persist
  const updated = await updateDesign(id, {
    properties: [...design.properties, property],
  });

  // Dispatch a property added event
  Events.dispatch<DesignPropertyAddedEventData>(DesignPropertyAddedEvent, {
    design: updated,
    property,
  });

  return updated;
}
