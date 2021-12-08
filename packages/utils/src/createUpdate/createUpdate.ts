import { FieldValue } from '../FieldValue';
import { applyFieldValues } from '../applyFieldValues';

export interface Update<Resource, Changes> {
  before: Resource;
  after: Resource;
  changes: Changes;
}

type WithUpdatedAt = {
  updatedAt: Date;
};

export interface CreateUpdateOptions {
  setUpdatedAt?: boolean;
  deleteEmptyFields?: string[];
}

/**
 * Creates an update object containing:
 * `after`: the updated object
 * `before`: the original object
 * `changes`: the changes applied to the object
 *
 * @param object The object to update.
 * @param data The changes to apply to the object.
 * @param options.setUpdatedAt If `true`, the `updatedAt` timestamp will be set to now.
 * @param options.deleteEmptyFields An array of field keys to delete if they are empty or undefined.
 * @returns An update object.
 */
export function createUpdate<C extends object, R extends object>(
  object: R,
  data: C,
  options: CreateUpdateOptions = {},
): Update<R, C | (C & WithUpdatedAt)> {
  // The original object
  const before = { ...object };
  // The changes made to the object
  const changes: C | (C & WithUpdatedAt) = options.setUpdatedAt
    ? { ...data, updatedAt: new Date() }
    : data;
  // The updated object
  const after = applyFieldValues(object, changes);

  // Delete empty fields specified in options.deleteEmptyFields
  if (options.deleteEmptyFields) {
    options.deleteEmptyFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(after, key)) {
        const value = after[key];

        if (
          (Array.isArray(value) && value.length === 0) ||
          value === '' ||
          typeof value === 'undefined'
        ) {
          delete after[key];
          changes[key] = FieldValue.delete();
        }
      }
    });
  }

  return { before, after, changes };
}
