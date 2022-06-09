import { Schema, StringValidator, validateValue } from '@minddrop/utils';
import {
  ResourceIdValidator,
  ResourceReference,
  ResourceReferenceValidator,
} from '../../types';
import { validateResourceId } from '../validateResourceId';

/**
 * Validates a resource reference. Throws a `ValidationError` if:
 * - The `resource` or `id` properties are missing or not strings.
 * - The reference contains properties other than `resource` and `id`.
 * - The resource is not registered.
 * - The resource document does not exist.
 *
 * @param validator A resource-reference validator.
 * @param value The value to validate.
 */
export function validateResourceReference(
  validator: ResourceReferenceValidator,
  value: unknown,
): void {
  const reference = value as ResourceReference;

  // Ensure that the validator is valid
  validateValue(
    { type: 'validator', allowedTypes: ['resource-reference'] },
    validator,
  );

  // Create a schema to validate the resource reference object with
  const schema: Schema<ResourceIdValidator | StringValidator> = {
    resource: {
      type: 'string',
      required: true,
      allowEmpty: false,
    },
    id: {
      type: 'string',
      required: true,
      allowEmpty: false,
    },
  };

  // Ensure that the value conforms to the resource reference schema
  validateValue({ type: 'object', schema }, value, {
    'resource-id': validateResourceId,
  });

  // Ensure that the value references a valid resource
  validateResourceId(
    { type: 'resource-id', resource: reference.resource },
    reference.id,
  );
}
