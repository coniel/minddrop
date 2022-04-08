import { ValidationError } from '../../errors';
import { StringFieldValidator } from '../../types';

/**
 * Validates a string.
 *
 * @param validator A string validator.
 * @param value The value to validate.
 */
export function validateString(
  validator: StringFieldValidator,
  value: unknown,
): void {
  // Ensure that the value is a string
  if (typeof value !== 'string') {
    throw new ValidationError(
      `must be of type 'string', received '${typeof value}'`,
    );
  }

  // Ensure that the string is not empty if `allowEmpty` is `false`.
  if (!validator.allowEmpty && !value.length) {
    throw new ValidationError(`cannot be empty`);
  }
}
