import { ValidationError } from '../../errors';
import { BooleanValidator } from '../../types';
import { validateValidator } from '../validateValidator';

/**
 * Validates a boolean.
 *
 * Throws a `ValidationError` if the value is
 * not a boolean.
 *
 * @param validator A boolean validator.
 * @param value The value to validate.
 */
export function validateBoolean(
  validator: BooleanValidator,
  value: unknown,
): void {
  // Ensure the validator is valid
  validateValidator(
    { type: 'validator', allowedTypes: ['boolean'] },
    validator,
  );

  // Ensure that the value is is a boolean
  if (typeof value !== 'boolean') {
    throw new ValidationError(
      `must be of type 'boolean', received '${typeof value}'`,
    );
  }
}
