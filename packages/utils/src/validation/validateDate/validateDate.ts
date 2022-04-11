import { ValidationError } from '../../errors';
import { DateValidator } from '../../types';

/**
 * Validates a date.
 *
 * @param validator A date validator.
 * @param value The value to validate.
 */
export function validateDate(validator: DateValidator, value: unknown): void {
  // Ensure that the value is a date
  if (!(value instanceof Date)) {
    throw new ValidationError(`must be a Date, received '${typeof value}'`);
  }
}
