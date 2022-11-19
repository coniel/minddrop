import { InvalidValidatorError, ValidationError } from '../../errors';
import { CoreValidator, Validator, ValidatorFunction } from '../../types';
import { validateBoolean } from '../validateBoolean';
import { validateDate } from '../validateDate';
import { validateString } from '../validateString';
import { validateEnum } from '../validateEnum';
import { validateNumber } from '../validateNumber';
import { validateArray } from '../validateArray';
import { validateObject } from '../validateObject';
import { validateSet } from '../validateSet';
import { validateNull } from '../validateNull';
import { validateRecord } from '../validateRecord';
import { validateSchema } from '../validateSchema';
import { validateFunction } from '../validateFunction';
import { validateValidator } from '../validateValidator';

/**
 * Validates a value against one or more provided
 * validators.
 *
 * Throws a `ValidationError` if the validation fails
 * all provided validators.
 *
 * @param validator The validator(s) against which to validate the value.
 * @param value The value to validate.
 * @param customValidatorFns A `{ [type]: ValidatorFn }` record of validator functions for custom validator types.
 */
export function validateValue<TValidator extends Validator = CoreValidator>(
  validator: TValidator,
  value: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  const primitiveValidator = validator as CoreValidator;
  const { type } = primitiveValidator;

  // Handle multiple validators by calling the
  // function on each inidvidual one.
  if (Array.isArray(type)) {
    // true if a single validator passes
    let passed = false;
    // Thrown validation errors
    const errors = [];

    type.forEach((v) => {
      try {
        // Validate the value suing the validator
        validateValue(v, value, customValidatorFns);

        // Validator did not throw, value has passed
        passed = true;
      } catch (error) {
        errors.push(error.message);
      }
    });

    if (!passed) {
      // Throw a `ValidationError` if the value failed all validators
      throw new ValidationError(
        `value failed all validators:\n- ${errors.join('\n- ')}`,
      );
    }

    return;
  }

  // If custom validator functions were provided, and the validator
  // type is a matching custom type, run the custom validator function.
  if (customValidatorFns && customValidatorFns[type]) {
    customValidatorFns[type](primitiveValidator, value, customValidatorFns);

    return;
  }

  // Perform type based validation
  switch (type) {
    case 'string':
      validateString(primitiveValidator, value);
      break;
    case 'number':
      validateNumber(primitiveValidator, value);
      break;
    case 'boolean':
      validateBoolean(primitiveValidator, value);
      break;
    case 'date':
      validateDate(primitiveValidator, value);
      break;
    case 'enum':
      validateEnum(primitiveValidator, value);
      break;
    case 'set':
      validateSet(primitiveValidator, value);
      break;
    case 'record':
      validateRecord(primitiveValidator, value, customValidatorFns);
      break;
    case 'null':
      validateNull(primitiveValidator, value);
      break;
    case 'array':
      validateArray(primitiveValidator, value, customValidatorFns);
      break;
    case 'object':
      validateObject(primitiveValidator, value, customValidatorFns);
      break;
    case 'schema':
      validateSchema(primitiveValidator, value);
      break;
    case 'function':
      validateFunction(primitiveValidator, value);
      break;
    case 'validator':
      validateValidator(primitiveValidator, value);
      break;
    default:
      // Invalid validator `type`
      throw new InvalidValidatorError(`unknown validator type '${type}'`);
  }
}
