import { InvalidParameterError } from '../../errors';
import { CoreValidator, Validator, ValidatorFunction } from '../../types';
import { validateValue } from '../validateValue';

type ParamterValidator<TValidator extends Validator = CoreValidator> =
  TValidator & {
    /**
     * Whether the parameter is required.
     * Defaults to `true`.
     */
    required?: boolean;
  };

/**
 * Validates a function parameter using the provided
 * parameter validator.
 *
 * Parameters are considered required unless `required`
 * is set to `false`.
 *
 * @param validator - The validator against which to validate the value.
 * @param name - The parameter name.
 * @param value - The value to validate.
 * @param customValidatorFns - A `{ [type]: ValidatorFn }` record of validator functions for custom validator types.
 */
export function validateParameter<
  TValidator extends ParamterValidator = ParamterValidator<CoreValidator>,
>(
  validator: TValidator,
  name: string,
  value?: unknown,
  customValidatorFns?: Record<string, ValidatorFunction>,
): void {
  if (validator.required !== false && typeof value === 'undefined') {
    // If the parameter is required and is undefined,
    // throw an error.
    throw new InvalidParameterError(`${name} is required`);
  }

  if (validator.required === false && typeof value === 'undefined') {
    // If the parameter is not required and is undefined,
    // stop here.
    return;
  }

  try {
    // Validate the parameter value
    validateValue(validator, value, customValidatorFns);
  } catch (error) {
    // Rethrow validation error as `InvalidParameterError`
    throw new InvalidParameterError(`${name} ${error.message}`);
  }
}
