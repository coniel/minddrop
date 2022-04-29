import { ValidationError } from '../../errors';
import { StringValidator, ValidatorOptionsSchema } from '../../types';
import { validateValidator } from '../validateValidator';

export const StringValidatorOptionsSchema: ValidatorOptionsSchema<StringValidator> =
  {
    allowEmpty: {
      type: 'boolean',
    },
  };

/**
 * Validates a string.
 *
 * Throws a `ValidationError` if the value is not a string or
 * is an empty string when the `allowEmpty` option is not `true`.
 *
 * @param validator A string validator.
 * @param value The value to validate.
 */
export function validateString(
  validator: StringValidator,
  value: unknown,
): void {
  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['string'],
      optionsSchemas: { string: StringValidatorOptionsSchema },
    },
    validator,
  );

  // Ensure that the value is a string
  if (typeof value !== 'string') {
    throw new ValidationError(
      `must be of type 'string', received '${typeof value}'`,
    );
  }

  // Ensure that the string is not empty if `allowEmpty` is `false`.
  if (!validator.allowEmpty && !value.length) {
    throw new ValidationError(`cannot be empty`);
  }
}
