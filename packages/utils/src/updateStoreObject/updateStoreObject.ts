import { unsetFields } from '../unsetFields';

/**
 * Updates an object by merging in data fields
 * and removing UNSET fields.
 *
 * @param object The object to update.
 * @param data The data to apply to the object.
 */
export function updateStoreObject<O, D>(object: O, data: D): O {
  const updated = unsetFields({
    ...object,
    ...data,
  });

  return updated;
}
