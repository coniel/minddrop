import { unsetFields } from '../unsetFields';

/**
 * Updates an object by merging in data fields
 * and removing UNSET fields.
 *
 * @param object The object to update.
 * @param data The data to apply to the object.
 */
export function updateStoreObject<O extends object, D extends object>(
  object: O,
  data: D,
): O {
  const updated = unsetFields<O>({
    ...object,
    ...data,
  });

  return updated;
}
