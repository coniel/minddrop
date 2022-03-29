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
    // Look for equivalent object
    return !objectsToRemove.find((objectToRemove) => {
      // Get all keys on the object to remove
      const keys = Object.keys(objectToRemove);

      // Objects are not equal if they have a different key count
      let areEqual = keys.length === Object.keys(object).length;

      if (areEqual) {
        // If the objects have the same key count, check that they
        // have the same key values.
        keys.forEach((key) => {
          if (areEqual) {
            areEqual = object[key] === objectToRemove[key];
          }
        });
      }

      return areEqual;
    });
  });
}
