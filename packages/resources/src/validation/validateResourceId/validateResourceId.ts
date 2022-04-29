import {
  StringValidator,
  validateValue,
  ValidationError,
  ValidatorOptionsSchema,
  ValidatorValidator,
} from '@minddrop/utils';
import { ResourceApisStore } from '../../ResourceApisStore';
import { ResourceIdValidator } from '../../types';

export const ResourceIdValidatorOptionsSchema: ValidatorOptionsSchema<ResourceIdValidator> =
  {
    resource: {
      type: 'string',
      required: true,
      allowEmpty: false,
    },
  };

/**
 * Validates a resource ID.
 *
 * @param validator A resource-id validator.
 * @param value The value to validate.
 *
 * @throws ValidationError
 * Thrown if the valid is not a valid ID string or the
 * resource does not exist.
 *
 * @throws InvalidValidatorError
 * Thrown if the supplied validator is invalid.
 */
export function validateResourceId(
  validator: ResourceIdValidator,
  value: unknown,
): void {
  // Ensure that the validator is valid
  validateValue<ValidatorValidator>(
    {
      type: 'validator',
      allowedTypes: ['resource-id'],
      optionsSchemas: { 'resource-id': ResourceIdValidatorOptionsSchema },
    },
    validator,
  );

  // Get the resoure config
  const Resource = ResourceApisStore.get(validator.resource);

  if (!Resource) {
    // Throw a `ValidationError` if the resource is not registered
    throw new ValidationError(
      `resource ${validator.resource} is not registered`,
    );
  }

  // Ensure that the value is a string
  validateValue<StringValidator>({ type: 'string', allowEmpty: false }, value);

  // Ensure that the referenced document exists
  if (!Resource.store.get(value as string)) {
    throw new ValidationError(
      `referenced \`${Resource.resource}\` document '${value}' does not exist`,
    );
  }
}
