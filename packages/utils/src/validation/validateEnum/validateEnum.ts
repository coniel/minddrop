import { InvalidValidatorError, ValidationError } from '../../errors';
import { EnumValidator, EnumValue } from '../../types';

/**
 * Validates an enum.
 *
 * @param validator An enum validator.
 * @param value The value to validate.
 */
export function validateEnum(validator: EnumValidator, value: unknown): void {
  // Ensure that the enum `options` contains only string, number,
  // boolean, or null values.
  validator.options.forEach((option) => {
    if (
      option !== null &&
      !['string', 'number', 'boolean'].includes(typeof option)
    ) {
      throw new InvalidValidatorError(
        `enums can only contain of a string, number, boolean, or null value. Reveived '${typeof option}'`,
      );
    }
  });

  // Ensure that the value is listed in the validator's `options`
  if (!validator.options.includes(value as EnumValue)) {
    throw new ValidationError(
      `invalid value ${JSON.stringify(
        value,
      )}, must be one of ${validator.options
        .map((option) => JSON.stringify(option))
        .join(',')}`,
    );
  }
}
