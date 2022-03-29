import { arrayContainsObject } from '../arrayContainsObject';

/**
 * Filters the given objects out of the provided array by
 * shalowly comapring all of their properties. Does not
 * support objects with objects as properties.
 *
 * @param objects Array of objects from which to remove objects.
 * @param objectsToRemove The objects to remove from the array.
 * @returns The array of objects with the given objects removed.
 */
export function removeObjectsFromArray<TObject extends Object = Object>(
  objects: TObject[],
  objectsToRemove: TObject[],
): TObject[] {
  // For each object, check if an equivalent object is in
  // the list of objects to remove.
  return objects.filter((object) => {
    // If there is an equivalent object, filter out this object
    return !arrayContainsObject(objectsToRemove, object);
  });
}
