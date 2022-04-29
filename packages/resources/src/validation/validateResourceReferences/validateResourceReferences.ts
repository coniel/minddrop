import {
  ValidatorOptionsSchema,
  ValidatorValidator,
  ArrayValidator,
  validateValue,
} from '@minddrop/utils';
import {
  ResourceReferencesValidator,
  ResourceReferenceValidator,
} from '../../types';
import { validateResourceReference } from '../validateResourceReference';

export const ResourceReferencesValidatorOptionsSchema: ValidatorOptionsSchema<ResourceReferencesValidator> =
  {
    allowEmpty: {
      type: 'boolean',
      required: false,
    },
  };

/**
 * Validates an array of resource references. Throws a `ValidationError` if:
 * - A `resource` or `id` properties are missing or not strings.
 * - A reference contains properties other than `resource` and `id`.
 * - A resource is not registered.
 * - A resource document does not exist.
 *
 * @param validator A resource-references validator.
 * @param value The value to validate.
 */
export function validateResourceReferences(
  validator: ResourceReferencesValidator,
  value: unknown,
): void {
  // Ensure that the validator is valid
  validateValue<ValidatorValidator>(
    {
      type: 'validator',
      allowedTypes: ['resource-references'],
      optionsSchemas: {
        'resource-references': ResourceReferencesValidatorOptionsSchema,
      },
    },
    validator,
  );

  // Ensure that the value is an array of resource references
  validateValue<ArrayValidator<ResourceReferenceValidator>>(
    {
      type: 'array',
      // `true` by default
      allowEmpty:
        typeof validator.allowEmpty === 'undefined'
          ? true
          : validator.allowEmpty,
      items: { type: 'resource-reference' },
    },
    value,
    {
      'resource-reference': validateResourceReference,
    },
  );
}
