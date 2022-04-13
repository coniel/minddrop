import { validateString, ValidationError } from '@minddrop/utils';
import { ResourceApisStore } from '../ResourceApisStore';
import { ResourceIdValidator } from '../types';

/**
 * Validates a resource ID.
 *
 * Throws a `ValidationError` if the value is not a valid ID
 * string or if the resource does not exist.
 *
 * @param validator A resource-id validator.
 * @param value The value to validate.
 */
export function validateResourceId(
  validator: ResourceIdValidator,
  value: unknown,
): void {
  // Get the resoure config
  const Resource = ResourceApisStore.get(validator.resource);

  if (!Resource) {
    // Throw a `ValidationError` if the resource is not registered
    throw new ValidationError(
      `resource ${validator.resource} is not registered`,
    );
  }

  // Ensure that the value is a string
  validateString({ type: 'string', allowEmpty: false }, value);

  // Ensure that the referenced document exists
  if (!Resource.store.get(value as string)) {
    throw new ValidationError(
      `referenced \`${Resource.resource}\` document '${value}' does not exist`,
    );
  }
}
