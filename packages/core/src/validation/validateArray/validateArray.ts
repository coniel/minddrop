import { InvalidValidatorError, ValidationError } from '../../errors';
import { ArrayFieldValidator, ValidatorFunction } from '../../types';
import { validateValue } from '../validateValue';

/**
 * Validates a array.
 *
 * @param validator An array validator.
 * @param value The value to validate.
 * @param customValidatorFns A { [type]: ValidatorFunction } map of custom validator types.
 */
export function validateArray(
  validator: ArrayFieldValidator,
  value: unknown[],
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  // Ensure that the value is a array
  if (!Array.isArray(value)) {
    throw new ValidationError(`must be a array, received '${typeof value}'`);
  }

  // Ensure that the array is not empty if `allowEmpty` is `false`.
  if (!validator.allowEmpty && !value.length) {
    throw new ValidationError('cannot be empty');
  }

  // Validate array items using the `items` validator
  if (validator.items) {
    try {
      value.forEach((item) => {
        validateValue(validator.items, item, customValidatorFns);
      });
    } catch (error) {
      // Re-throw `ValidationError` to add aditional context
      if (error instanceof ValidationError) {
        throw new ValidationError(`array items ${error.message}`);
      }

      // Error is not a `ValidationError`, throw it as is
      throw error;
    }
  }

  // Validate array items using the `itemValidatorFn`
  if (validator.itemValidatorFn) {
    value.forEach((item) => validator.itemValidatorFn(item));
  }

  // Ensure that the validator validates the array items using either
  // the `items` validator or a `itemValidatorFn`.
  if (!validator.items && !validator.itemValidatorFn) {
    throw new InvalidValidatorError(
      'array validator must contain `items` validator or `itemValidatorFn` (or both)',
    );
  }
}
