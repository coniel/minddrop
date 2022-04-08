import { InvalidValidatorError, ValidationError } from '../../errors';
import { SetValue, SetValidator } from '../../types';
import { validateArray } from '../validateArray';

/**
 * Validates a set.
 *
 * @param validator A set validator.
 * @param value The value to validate.
 */
export function validateSet(validator: SetValidator, value: unknown[]): void {
  // Ensure that the set `options` contains only string, number,
  // boolean, or null values.
  validator.options.forEach((option) => {
    if (
      option !== null &&
      !['string', 'number', 'boolean'].includes(typeof option)
    ) {
      throw new InvalidValidatorError(
        `sets can only contain of a string, number, boolean, or null value. Reveived '${typeof option}'`,
      );
    }
  });

  // Validate the set array
  validateArray(
    {
      type: 'array',
      // Can be empty unless explicitly specified not to
      allowEmpty: validator.allowEmpty !== false,
      itemValidatorFn: (element) => {
        // Ensure that every element in the set is listed in
        // `otpions`.
        if (!validator.options.includes(element as SetValue)) {
          throw new ValidationError(
            `invalid element ${JSON.stringify(
              value,
            )}, set may only contain ${validator.options
              .map((option) => JSON.stringify(option))
              .join(',')}`,
          );
        }
      },
    },
    value,
  );
}
