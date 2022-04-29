import { ValidationError } from '../../errors';
import {
  MultiTypeValidator,
  CoreValidator,
  RecordValidator,
  Validator,
  ValidatorFunction,
  ValidatorOptionsSchema,
} from '../../types';
import { validateValidator } from '../validateValidator';
import { validateValue } from '../validateValue';

export const RecordValidatorOptionsSchema: ValidatorOptionsSchema<RecordValidator> =
  {
    values: {
      type: 'validator',
      required: true,
    },
    allowEmpty: {
      type: 'boolean',
    },
  };

/**
 *
 * @param validator A record validator.
 * @param value The value to validate.
 * @param customValidatorFns A `{ [type]: ValidatorFunction }` record of custom validator types.
 */
export function validateRecord<
  TValuesValidator extends Validator | MultiTypeValidator = CoreValidator,
>(
  validator: RecordValidator<TValuesValidator>,
  value: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  const allowEmpty =
    typeof validator.allowEmpty === 'undefined' ? true : validator.allowEmpty;

  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['record'],
      optionsSchemas: { record: RecordValidatorOptionsSchema },
    },
    validator,
  );

  // Ensure that the schema is a non-null object
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError(
      `must be an object, received '${value === null ? `null` : typeof value}'`,
    );
  }

  // Ensure that the record is not empty if `allowEmpty` if false
  if (!allowEmpty && Object.keys(value).length === 0) {
    throw new ValidationError('cannot be empty');
  }

  // Validate the record values
  Object.values(value).forEach((recordValue) => {
    validateValue(validator.values, recordValue, customValidatorFns);
  });
}
