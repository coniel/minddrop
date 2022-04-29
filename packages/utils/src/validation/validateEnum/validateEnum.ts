import { InvalidValidatorError, ValidationError } from '../../errors';
import { EnumValidator, EnumValue, ValidatorOptionsSchema } from '../../types';
import { validateValidator } from '../validateValidator';

export const EnumValidatorOptionSchema: ValidatorOptionsSchema<EnumValidator> =
  {
    options: {
      type: 'array',
      allowEmpty: false,
      required: true,
      items: {
        type: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'null' },
        ],
      },
    },
  };

/**
 * Validates an enum.
 *
 * Throws a `ValidationError` if the value is not
 * a one of the enum options.
 *
 * @param validator An enum validator.
 * @param value The value to validate.
 */
export function validateEnum(validator: EnumValidator, value: unknown): void {
  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['enum'],
      optionsSchemas: { enum: EnumValidatorOptionSchema },
    },
    validator,
  );

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
