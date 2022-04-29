import { ValidationError } from '../../errors';
import { NullValidator } from '../../types';
import { validateValidator } from '../validateValidator';

/**
 * Validates a null value.
 *
 * Throws a `ValidationError` if the value is not `null`.
 *
 * @param validator A null validator.
 * @param value The value to validate.
 */
export function validateNull(validator: NullValidator, value: unknown): void {
  // Ensure that the validator is valid
  validateValidator({ type: 'validator', allowedTypes: ['null'] }, validator);

  // Ensure that the value is `null`
  if (value !== null) {
    throw new ValidationError('must be null');
  }
}
