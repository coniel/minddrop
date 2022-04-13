import { ResourceValidationError } from '../../errors';
import { ResourceReference } from '../../types';

/**
 * Validates a resource reference, checking that it has valid
 * `resource` and `id` properties, and no other properties.
 *
 * @param resourceReference The resource reference to validate.
 */
export function validateResourceReference(
  resourceReference: ResourceReference,
): void {
  // Verify that the reference has a `resource`
  if (!resourceReference.resource) {
    throw new ResourceValidationError('property `resource` is required');
  }

  // Verify that `resource` is a string
  if (typeof resourceReference.resource !== 'string') {
    throw new ResourceValidationError('property `resource` must be a string');
  }

  // Verify that the reference has an `id`
  if (!resourceReference.id) {
    throw new ResourceValidationError('property `id` is required');
  }

  // Verify that `id` is a string
  if (typeof resourceReference.id !== 'string') {
    throw new ResourceValidationError('property `id` must be a string');
  }

  // Verify that the reference does not have any additional fields
  if (Object.keys(resourceReference).length > 2) {
    // Get the extra key names
    const extraKeys = Object.keys(resourceReference).filter(
      (key) => !['resource', 'id'].includes(key),
    );

    throw new ResourceValidationError(
      `only \`resource\` and \`id\` properties are allowed, found additional properties: \`${extraKeys.join(
        '`, `',
      )}\``,
    );
  }
}
