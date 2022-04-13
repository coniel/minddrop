import { Schema, validateObject } from '@minddrop/utils';
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
  // Get the value as an object in order to ensure that
  // the function doesn't fail when creating the schema.
  const resourceReference =
    typeof value === 'object' && value !== null
      ? (value as ResourceReference)
      : { resource: '' };

  // Create a schema to validate the resource reference object with
  const schema: Schema<ResourceIdValidator> = {
    resource: { type: 'string', required: true, allowEmpty: false },
    id: {
      type: 'resource-id',
      required: true,
      resource: resourceReference.resource,
    },
  };

  // Validate the value using the schema
  validateObject({ type: 'object', schema }, resourceReference, {
    'resource-id': validateResourceId,
  });
}
