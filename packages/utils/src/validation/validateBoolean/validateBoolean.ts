import { ValidationError } from '../../errors';
import { BooleanValidator } from '../../types';

/**
 * Validates a boolean.
 *
 * @param validator A boolean validator.
 * @param value The value to validate.
 */
export function validateBoolean(
  validator: BooleanValidator,
  value: unknown,
): void {
  // Ensure that the value is is a boolean
  if (typeof value !== 'boolean') {
    throw new ValidationError(
      `must be of type 'boolean', received '${typeof value}'`,
    );
  }
}
