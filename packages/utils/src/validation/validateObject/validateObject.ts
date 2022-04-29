import {
  InvalidSchemaError,
  InvalidValidatorError,
  ValidationError,
} from '../../errors';
import {
  CoreFieldValidator,
  FieldValidator,
  ObjectValidator,
  ValidatorFunction,
  ValidatorOptionsSchema,
} from '../../types';
import { validateValidator } from '../validateValidator';
import { validateValue } from '../validateValue';

export const ObjectValidatorOptionsSchema: ValidatorOptionsSchema<ObjectValidator> =
  {
    schema: {
      type: 'string',
    },
  };

/**
 * Validates an object.
 *
 * @param validator An object validator.
 * @param object The value to validate.
 * @param customValidatorFns A `{ [type]: ValidatorFunction }` record of custom validator types.
 */
export function validateObject<
  TValidator extends FieldValidator = CoreFieldValidator,
>(
  validator: ObjectValidator<TValidator>,
  value: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  const object = value as Object;
  const { schema } = validator;

  // Ensure that the validator is valid
  validateValidator({ type: 'validator', allowedTypes: ['object'] }, validator);

  // Ensure that the value is a non-null object
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError('must be an object');
  }

  // Loop through the schema's fieldNames to validate every field
  Object.keys(schema).forEach((fieldName) => {
    // Get the field's validator
    const validator = schema[fieldName];
    // Get the field's value
    const value = object[fieldName];
    // Whether the value is set or not
    const hasValue = typeof value !== 'undefined';

    // Validate required field
    if (validator.required && typeof value === 'undefined') {
      throw new ValidationError(`property '${fieldName}' is required`);
    }

    // Validate a `requiredWith` field
    if (validator.requiredWith && !hasValue) {
      // If the field is not present, ensure that none of the
      // `requiredWith` fields are present.
      validator.requiredWith.forEach((otherFieldName) => {
        if (object[otherFieldName]) {
          throw new ValidationError(
            `property '${fieldName}' is required when property '${otherFieldName}' is present`,
          );
        }
      });
    }

    // Validate a `requiredWithout` field
    if (validator.requiredWithout && !hasValue) {
      // If the field is not present, ensure that all of the
      // `requiredWithout` fields are present.
      validator.requiredWithout.forEach((otherFieldName) => {
        if (!object[otherFieldName]) {
          throw new ValidationError(
            `property '${fieldName}' is required when property '${otherFieldName}' is not present`,
          );
        }
      });
    }

    // Validate a `forbidenWith` field
    if (validator.forbidenWith && hasValue) {
      // If the field is present, ensure that none of the
      // `forbidenWith` fields are present.
      validator.forbidenWith.forEach((otherFieldName) => {
        if (object[otherFieldName]) {
          throw new ValidationError(
            `property '${fieldName}' is forbiden when property '${otherFieldName}' is present`,
          );
        }
      });
    }

    // Validate a `forbidenWithout` field
    if (validator.forbidenWithout && hasValue) {
      // If the field is present, ensure that all of the
      // `forbidenWithout` fields are present.
      validator.forbidenWithout.forEach((otherFieldName) => {
        if (!object[otherFieldName]) {
          throw new ValidationError(
            `property '${fieldName}' is forbiden when property '${otherFieldName}' is not present`,
          );
        }
      });
    }

    // If the field is not present on the object, end here
    if (typeof value === 'undefined') {
      return;
    }

    try {
      // Perform validator based validation
      validateValue(schema[fieldName], value, customValidatorFns);

      // Get the validator's `validatorFn`
      const validatorFn = schema[fieldName]
        .validatorFn as FieldValidator['validatorFn'];

      // Call the `validatorFn` if defined
      if (validatorFn) {
        validatorFn(value, object);
      }
    } catch (error) {
      // Re-throw `ValidationError` to add aditional context
      if (error instanceof ValidationError) {
        throw new ValidationError(`property '${fieldName}' ${error.message}`);
      }

      // Re-throw `InvalidValidatorError` as a `InvalidSchemaError`,
      // adding additional context.
      if (error instanceof InvalidValidatorError) {
        throw new InvalidSchemaError(
          `${error.message} for property '${fieldName}'`,
        );
      }

      // Throw other errors as they are
      throw error;
    }
  });

  // Check that the object does not contain fields which
  // are not listed in the shcema.
  Object.keys(object).forEach((fieldName) => {
    if (!schema[fieldName]) {
      // If the field is not listed in the schema, throw a
      // `ValidationError`.
      throw new ValidationError(
        `objects may only contain properties listed in their schema, found additional property '${fieldName}'`,
      );
    }
  });
}
