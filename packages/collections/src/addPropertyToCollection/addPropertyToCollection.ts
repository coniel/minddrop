import { CollectionPropertySchemas } from '../constants';
import { CollectionNotFoundError } from '../errors';
import { getCollection } from '../getCollection';
import { CollectionPropertyType } from '../types/CollectionPropertiesSchema.types';
import { updateCollection } from '../updateCollection';

/**
 * Adds a property to a collection.
 *
 * @param path - The path of the collection to add the property to.
 * @param name - The name of the property to add.
 * @param type - The type of the property to add.
 *
 * @dispatches collections:collection:update
 *
 * @throws {CollectionNotFoundError} - Thrown if the collection does not exist.
 */
export async function addPropertyToCollection(
  path: string,
  name: string,
  type: CollectionPropertyType,
): Promise<void> {
  let key = name;

  // Get the collection
  const collection = getCollection(path);

  // Ensure the collection exists
  if (!collection) {
    throw new CollectionNotFoundError(path);
  }

  // If the property already exists, increment the name
  // to avoid overwriting it.
  if (collection.properties.find((p) => p.name === key)) {
    let i = 1;

    while (collection.properties.find((p) => p.name === key)) {
      key = `${name} ${i}`;
      i++;
    }
  }

  // Add the property to the collection's properties
  await updateCollection(path, {
    properties: [
      ...collection.properties,
      {
        ...CollectionPropertySchemas[type],
        name: key,
      },
    ],
  });
}
