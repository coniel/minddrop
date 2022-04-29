import { ValidationError } from '../../errors';
import { SetValue, SetValidator, ValidatorOptionsSchema } from '../../types';
import { validateArray } from '../validateArray';
import { validateValidator } from '../validateValidator';

export const SetValidatorOptionsSchema: ValidatorOptionsSchema<SetValidator> = {
  options: {
    type: 'array',
    required: true,
    allowEmpty: false,
    items: {
      type: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'null' },
      ],
    },
  },
  allowEmpty: {
    type: 'boolean',
  },
};

/**
 * Validates a set.
 *
 * Throws a `ValidationError` if any of the values are not
 * listed in `options` or is empty when the `allowEmpty`
 * option is `false`.
 *
 * @param validator A set validator.
 * @param value The value to validate.
 */
export function validateSet(validator: SetValidator, value: unknown): void {
  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['set'],
      optionsSchemas: { set: SetValidatorOptionsSchema },
    },
    validator,
  );

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
