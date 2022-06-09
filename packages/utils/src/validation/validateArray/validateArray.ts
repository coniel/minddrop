import { ValidationError } from '../../errors';
import {
  ArrayValidator,
  CoreValidator,
  Validator,
  ValidatorFunction,
} from '../../types';
import { validateValidator } from '../validateValidator';
import { validateValue } from '../validateValue';
import { ArrayValidatorOptionsSchema } from '../validator-options-schemas';

/**
 * Validates a array.
 *
 * Throws a `ValidationError` if the value is not an array
 * or the array items are invalid.
 *
 * @param validator An array validator.
 * @param value The value to validate.
 * @param customValidatorFns A `{ [type]: ValidatorFunction }` record of custom validator types.
 */
export function validateArray<
  TItemValidator extends Validator = CoreValidator,
  TItemType = unknown,
>(
  validator: ArrayValidator<TItemValidator, TItemType>,
  value: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['array'],
      optionsSchemas: { array: ArrayValidatorOptionsSchema },
    },
    validator,
  );

  // Ensure that the value is a array
  if (!Array.isArray(value)) {
    throw new ValidationError(`must be a array, received '${typeof value}'`);
  }

  // Ensure that the array is not empty if `allowEmpty` is `false`.
  if (!validator.allowEmpty && !value.length) {
    throw new ValidationError('cannot be empty');
  }

  // Validate array items
  try {
    if (validator.items) {
      value.forEach((item) => {
        // Validate the value using the `items` validator if present
        validateValue(validator.items, item, customValidatorFns);
      });
    }

    if (validator.itemValidatorFn) {
      // Validate array items using the `itemValidatorFn` if present
      value.forEach((item) => validator.itemValidatorFn(item));
    }
  } catch (error) {
    // Re-throw `ValidationError` to add aditional context
    if (error instanceof ValidationError) {
      throw new ValidationError(`array items ${error.message}`);
    }

    // Error is not a `ValidationError`, throw it as is
    throw error;
  }
}
