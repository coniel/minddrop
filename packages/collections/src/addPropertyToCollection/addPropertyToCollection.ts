import { InvalidParameterError } from '@minddrop/core';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import { CollectionPropertySchema } from '../types/CollectionPropertiesSchema.types';
import { updateCollection } from '../updateCollection';

/**
 * Adds a property to a collection.
 *
 * @param path - The path of the collection to add the property to.
 * @param name - The name of the property to add.
 * @param property - The schema of the property to add.
 *
 * @dispatches collections:collection:update
 *
 * @throws {CollectionNotFoundError} - Thrown if the collection does not exist.
 * @throws {InvalidParameterError} - Thrown if the property already exists.
 */
export async function addPropertyToCollection(
  path: string,
  name: string,
  property: CollectionPropertySchema,
): Promise<void> {
  // Get the collection
  const collection = getCollection(path);

  // Ensure the collection exists
  if (!collection) {
    throw new CollectionNotFoundError(path);
  }

  // Ensure the property doesn't already exist
  if (collection.properties[name]) {
    throw new InvalidParameterError(`The property "${name}" already exists.`);
  }

  // Add the property to the collection's properties
  await updateCollection(path, {
    properties: { ...collection.properties, [name]: property },
  });
}
