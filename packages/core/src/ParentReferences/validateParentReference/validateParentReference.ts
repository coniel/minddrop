import { ParentReferenceValidationError } from '../../errors';
import { ParentReference } from '../../types';

/**
 * Validates a parent reference, checking that it has valid
 * `type` and `id` properties, and no other properties.
 *
 * @param parentReference The parent reference to validate.
 */
export function validateParentReference(
  parentReference: ParentReference,
): void {
  // Verify that the reference has a `type`
  if (!parentReference.type) {
    throw new ParentReferenceValidationError('property `type` is required');
  }

  // Verify that `type` is a string
  if (typeof parentReference.type !== 'string') {
    throw new ParentReferenceValidationError(
      'property `type` must be a string',
    );
  }

  // Verify that the reference has an `id`
  if (!parentReference.id) {
    throw new ParentReferenceValidationError('property `id` is required');
  }

  // Verify that `id` is a string
  if (typeof parentReference.id !== 'string') {
    throw new ParentReferenceValidationError('property `id` must be a string');
  }

  // Verify that the reference does not have any additional fields
  if (Object.keys(parentReference).length > 2) {
    // Get the extra key names
    const extraKeys = Object.keys(parentReference).filter(
      (key) => !['type', 'id'].includes(key),
    );

    throw new ParentReferenceValidationError(
      `only \`type\` and \`id\` properties are allowed, found additional properties: \`${extraKeys.join(
        '`, `',
      )}\``,
    );
  }
}
