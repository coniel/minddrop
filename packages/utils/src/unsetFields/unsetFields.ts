export type Unset = '__UNSET__';

export const UNSET = '__UNSET__';

/**
 * Removes fields set to __UNSET__ from an object.
 *
 * @param object The object from which to remove the fields.
 */
export function unsetFields<O>(object: O): O {
  const cleaned = { ...object };

  Object.keys(object).forEach((key) => {
    if (object[key] === '__UNSET__') {
      delete cleaned[key];
    }
  });

  return cleaned;
}
