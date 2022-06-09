import { ValidationError } from '../../errors';
import { DateValidator } from '../../types';
import { validateValidator } from '../validateValidator';

/**
 * Validates a date.
 *
 * Throws a `ValidationError` if the value is not a date.
 *
 * @param validator A date validator.
 * @param value The value to validate.
 */
export function validateDate(validator: DateValidator, value: unknown): void {
  // Ensure the validator is valid
  validateValidator({ type: 'validator', allowedTypes: ['date'] }, validator);

  // Ensure that the value is a date
  if (!(value instanceof Date)) {
    throw new ValidationError(`must be a Date, received '${typeof value}'`);
  }
}
