import { InvalidParameterError } from '@minddrop/core';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import { updateCollection } from '../updateCollection';

/**
 * Deletes a collection property with the given schema.
 *
 * @param path - The path of the collection to delete.
 * @param property - The name of the property to delete.
 *
 * @dispatches collections:collection:update
 *
 * @throws {CollectionNotFoundError} Thrown if the collection does not exist.
 * @throws {InvalidParameterError} Thrown if the property does not exist.
 */
export async function deleteCollectionProperty(
  path: string,
  property: string,
): Promise<void> {
  const collection = getCollection(path);

  // Ensure the collection exists
  if (!collection) {
    throw new CollectionNotFoundError(path);
  }

  // Ensure the property exists
  if (!collection.properties.find((p) => p.name === property)) {
    throw new InvalidParameterError(
      `The property "${property}" does not exist on the collection "${path}".`,
    );
  }

  // Delete the collection property
  const updatedProperties = collection.properties.filter(
    (p) => p.name !== property,
  );

  // Update the collection
  await updateCollection(path, {
    properties: updatedProperties,
  });
}
