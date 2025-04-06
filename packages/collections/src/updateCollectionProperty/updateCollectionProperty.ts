import { InvalidParameterError } from '@minddrop/core';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import { CollectionPropertySchema } from '../types';
import { updateCollection } from '../updateCollection';

/**
 * Updates a collection property with the given schema.
 *
 * @param path - The path of the collection to update.
 * @param property - The name of the property to update.
 * @param schema - The updated property schema.
 *
 * @dispatches collections:collection:update
 *
 * @throws {CollectionNotFoundError} Thrown if the collection does not exist.
 * @throws {InvalidParameterError} Thrown if the property does not exist.
 */
export async function updateCollectionProperty<
  TSchema extends CollectionPropertySchema = CollectionPropertySchema,
>(path: string, property: string, schema: TSchema): Promise<void> {
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

  // Update the property schema
  const updatedProperties = collection.properties.map((p) => {
    if (p.name === property) {
      return {
        ...p,
        ...schema,
      };
    }

    return p;
  });

  // Update the collection property
  await updateCollection(path, {
    properties: updatedProperties,
  });
}
