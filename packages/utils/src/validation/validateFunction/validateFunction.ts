import { ValidationError } from '../../errors';
import { FunctionValidator } from '../../types';
import { validateValidator } from '../validateValidator';

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
  // Ensure that the validator is valid
  validateValidator(
    { type: 'validator', allowedTypes: ['function'] },
    validator,
  );

  // Ensure that the value is a function
  if (typeof value !== 'function') {
    throw new ValidationError('must be a function');
  }
}
