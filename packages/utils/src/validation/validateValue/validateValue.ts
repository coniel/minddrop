import { InvalidValidatorError } from '../../errors';
import { PrimitiveValidator, Validator, ValidatorFunction } from '../../types';
import { validateBoolean } from '../validateBoolean';
import { validateDate } from '../validateDate';
import { validateString } from '../validateString';
import { validateEnum } from '../validateEnum';
import { validateNumber } from '../validateNumber';
import { validateArray } from '../validateArray';
import { validateObject } from '../validateObject';
import { validateSet } from '../validateSet';

/**
 * Does something useful.
 */
export function validateValue<
  TValidator extends Validator = PrimitiveValidator,
>(
  validator: TValidator,
  value: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  const primitiveValidator = validator as PrimitiveValidator;
  const { type } = primitiveValidator;

  // If custom validator functions were provided, and the validator
  // type is a matching custom type, run the custom validator function.
  if (customValidatorFns && customValidatorFns[type]) {
    customValidatorFns[type](validator, value, customValidatorFns);
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
    case 'array':
      validateArray(primitiveValidator, value as unknown[], customValidatorFns);
      break;
    case 'object':
      validateObject(primitiveValidator, value as {}, customValidatorFns);
      break;
    case 'enum':
      validateEnum(primitiveValidator, value);
      break;
    case 'set':
      validateSet(primitiveValidator, value as unknown[]);
      break;
    default:
      // Invalid validator `type`
      throw new InvalidValidatorError(`invalid validator type '${type}'`);
  }
}
