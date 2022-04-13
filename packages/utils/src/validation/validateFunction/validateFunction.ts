import { ValidationError } from '../../errors';
import { FunctionValidator } from '../../types';

/**
 * Validates that a value is a function. Throws a
 * `ValidationError` if the value is not a function.
 *
 * @param validator A function validator.
 * @param value The value to validate.
 */
export function validateFunction(
  validator: FunctionValidator,
  value: unknown,
): void {
  if (typeof value !== 'function') {
    // Throw a `ValidationError` if the value is not a function
    throw new ValidationError('must be a function');
  }
}
