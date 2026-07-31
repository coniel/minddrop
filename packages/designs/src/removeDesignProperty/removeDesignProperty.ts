import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import {
  DesignPropertyRemovedEvent,
  DesignPropertyRemovedEventData,
} from '../events';
import { getDesign } from '../getDesign';
import { Design } from '../types';
import { updateDesign } from '../updateDesign';
import { remapLayoutPropertyBindings } from '../utils';

/**
 * Removes a property from a design and unbinds layout elements
 * bound to it.
 *
 * @param id - The ID of the design to remove the property from.
 * @param propertyName - The name of the property to remove.
 * @returns The updated design.
 *
 * @dispatches 'designs:property:removed'
 *
 * @throws {DesignNotFoundError} If the design does not exist.
 * @throws {InvalidParameterError} If the property does not exist on the design.
 */
export async function removeDesignProperty(
  id: string,
  propertyName: string,
): Promise<Design> {
  // Get the design
  const design = getDesign(id);

  // Find the property
  const property = design.properties.find(
    (existing) => existing.name === propertyName,
  );

  if (!property) {
    throw new InvalidParameterError(
      `Design ${id} has no property named ${propertyName}.`,
    );
  }

  // Filter the property out, unbind layout elements bound to it,
  // then persist
  const updated = await updateDesign(id, {
    properties: design.properties.filter(
      (existing) => existing.name !== propertyName,
    ),
    layouts: remapLayoutPropertyBindings(design.layouts, propertyName, null),
  });

  // Dispatch a property removed event
  Events.dispatch<DesignPropertyRemovedEventData>(DesignPropertyRemovedEvent, {
    design: updated,
    property,
  });

  return updated;
}
