import {
  validateValue,
  ValidatorOptionsSchema,
  ValidatorValidator,
  ArrayValidator,
} from '@minddrop/utils';
import { ResourceIdsValidator } from '../../types';
import { validateResourceId } from '../validateResourceId/validateResourceId';

export const ResourceIdsValidatorOptionsSchema: ValidatorOptionsSchema<ResourceIdsValidator> =
  {
    resource: {
      type: 'string',
      required: true,
      allowEmpty: false,
    },
    addAsParent: {
      type: 'boolean',
      required: false,
    },
  };

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
  // Ensure that the validator is valid
  validateValue<ValidatorValidator>(
    {
      type: 'validator',
      allowedTypes: ['resource-ids'],
      optionsSchemas: { 'resource-ids': ResourceIdsValidatorOptionsSchema },
    },
    validator,
  );

  // Ensure that the value is an array of resource IDs
  validateValue<ArrayValidator>(
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
