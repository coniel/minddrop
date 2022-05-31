import { InvalidValidatorError, ValidationError } from '../../errors';
import { NumberValidator } from '../../types';
import { validateValidator } from '../validateValidator';
import { NumberValidatorOptionsSchema } from '../validator-options-schemas';

/**
 * Validates a number.
 *
 * @param validator A number validator.
 * @param value The value to validate.
 */
export function validateNumber(
  validator: NumberValidator,
  value: unknown,
): void {
  const { min, max } = validator;

  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['number'],
      optionsSchemas: { number: NumberValidatorOptionsSchema },
    },
    validator,
  );

  // Ensure that the `min` value is less than the `max` value
  // if both are set.
  if (typeof min !== 'undefined' && typeof max !== 'undefined' && min > max) {
    throw new InvalidValidatorError("'min' cannot be greater than 'max'");
  }

  // Ensure that the value is a number
  if (typeof value !== 'number') {
    throw new ValidationError(
      `must be of type 'number', received '${typeof value}'`,
    );
  }

  // Ensure that the number is less than or equal to `max`
  if (typeof min !== 'undefined' && value < min) {
    throw new ValidationError(
      `must be greater than or equal to ${min}, received ${value}`,
    );
  }

  // Ensure that the number is less than or equal to `max`
  if (typeof max !== 'undefined' && value > max) {
    throw new ValidationError(
      `must be less than or euqal to ${max}, received ${value}`,
    );
  }
}
