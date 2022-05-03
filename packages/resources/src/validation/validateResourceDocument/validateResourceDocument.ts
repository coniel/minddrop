import {
  InvalidResourceSchemaError,
  ResourceValidationError,
} from '../../errors';
import { ResourceDocumentDataSchema, ResourceDocument } from '../../types';
import {
  InvalidSchemaError,
  ValidationError,
  ValidatorFunction,
  validateValue,
} from '@minddrop/utils';
import { generateResourceDocumentSchema } from '../generateResourceDocumentSchema';
import { validateContentColor } from '../validateContentColor';

// Validator functions for special resource document fields
const resourceFieldValidators: Record<string, ValidatorFunction> = {
  'content-color': validateContentColor,
};

/**
 * Validates a resource document against its data schema
 * as well as default resource document properties.
 *
 * @param resource The resource identifier.
 * @param dataSchema The resource data schema.
 * @param document The document to validate.
 * @param originalDocument The original document against which to validate (when validating an update).
 *
 * @throws ResourceValidationError
 * Thrown if the resource document is invalid.
 *
 * @throws InvalidSchemaError
 * Thrown if the resource data schema is invalid.
 */
export function validateResourceDocument<TData>(
  resource: string,
  dataSchema: ResourceDocumentDataSchema<TData>,
  document: ResourceDocument<TData>,
  originalDocument?: object,
): void {
  // Create a resource document schema from the resource data schema
  const schema = generateResourceDocumentSchema(dataSchema);

  // Validate the schema
  try {
    // Validate the resource object against the document schema
    validateValue(
      { type: 'object', schema },
      document,
      resourceFieldValidators,
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      // Catch validation errors and re-throw them as a
      // `ResourceValidationError`, adding additional context.
      throw new ResourceValidationError(
        `[${resource}:${document.id}] ${error.message}`,
      );
    }

    if (error instanceof InvalidSchemaError) {
      // Catch invalid schema errors and re-throw them as a
      // `InvalidResourceSchemaError` with additional context.
      throw new InvalidResourceSchemaError(`[${resource}] ${error.message}`);
    }

    // Rethrow other errors as they are
    throw error;
  }

  // Validate static fields
  if (originalDocument) {
    // Ensure that static fields have not changed
    Object.keys(schema).forEach((field) => {
      if (
        // Field is a static field
        schema[field].static &&
        // Original value does not match new value
        originalDocument[field] !== document[field]
      ) {
        throw new ResourceValidationError(
          `[${resource}:${document.id}] updating static field '${field}' is forbiden`,
        );
      }
    });
  }
}
