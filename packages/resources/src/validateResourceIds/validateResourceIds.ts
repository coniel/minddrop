import { validateArray } from '@minddrop/utils';
import { ResourceIdsValidator } from '../types';
import { validateResourceId } from '../validateResourceId/validateResourceId';

/**
 * Validates an array of resource IDs.
 *
 * Throws a `ValidationError` if the values are not a valid ID
 * strings, the resource is not registered, or a resource
 * document does not exist.
 *
 * @param validator A resource-id validator.
 * @param value The value to validate.
 */
export function validateResourceIds(
  validator: ResourceIdsValidator,
  value: unknown,
): void {
  // Ensure that the value is an array
  validateArray(
    {
      type: 'array',
      itemValidatorFn: (item) =>
        // Ensure that each array item is a valid resource ID
        validateResourceId(
          {
            type: 'resource-id',
            resource: validator.resource,
          },
          item,
        ),
    },
    value as unknown[],
  );
}
