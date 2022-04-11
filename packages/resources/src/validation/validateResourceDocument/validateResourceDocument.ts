import { ResourceValidationError } from '../../errors';
import { ResourceDataSchema, ResourceDocument } from '../../types';
import { validateObject } from '@minddrop/utils';
import { generateResourceDocumentSchema } from '../generateResourceDocumentSchema';

/**
 * Validates a resource document against its data schema
 * as well as default resource document properties.
 *
 * - Throws a `ResourceValidationError` if the resource document is invalid.
 * - Throws a `InvalidSchemaError` if the schema is invalid.
 * - Throws a `InvalidValidatorError` if a validator is invalid.
 *
 * @param resource The resource identifier.
 * @param dataSchema The resource data schema.
 * @param document The document to validate.
 * @param originalDocument The original document against which to validate (when validating an update).
 */
export function validateResourceDocument<TData>(
  resource: string,
  dataSchema: ResourceDataSchema<TData>,
  document: ResourceDocument<TData>,
  originalDocument?: object,
): void {
  // Create a resource document schema from the resource data schema
  const schema = generateResourceDocumentSchema(dataSchema);

  try {
    // Validate the resource object against the document schema
    validateObject({ type: 'object', schema }, document);
  } catch (error) {
    // Catch validation errors and re-throw them as a
    // `ResourceValidationError`, adding additional context.
    throw new ResourceValidationError(
      `[${resource}:${document.id}] ${error.message}`,
    );
  }

  // Validate protected fields
  if (originalDocument) {
    // Ensure that protected fields have not changed
    Object.keys(schema).forEach((field) => {
      if (
        // Field is a protected field
        schema[field].protected &&
        // Original value does not match new value
        originalDocument[field] !== document[field]
      ) {
        throw new ResourceValidationError(
          `[${resource}:${document.id}] updating protected field '${field}' is forbiden`,
        );
      }
    });
  }
}
