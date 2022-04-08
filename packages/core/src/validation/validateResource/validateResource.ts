import {
  InvalidResourceSchemaError,
  ResourceValidationError,
} from '../../errors';
import { Resource, ResourceSchema } from '../../types';
import { validateObject } from '../validateObject';

/**
 * Does something useful.
 */
export function validateResource<TResource extends Resource = Resource>(
  resourceType: string,
  schema: ResourceSchema,
  resource: TResource,
  originalResource?: object,
): void {
  // Add the ID validator to the schema
  const schemaWithId: ResourceSchema = {
    ...schema,
    id: {
      type: 'string',
      required: true,
      protected: true,
    },
  };

  // Ensure that the provided schema does not contain a
  // custom `id` field validator.
  if (schema.id) {
    throw new InvalidResourceSchemaError(
      "property 'id' is validated automatically and should not be inlcuded in the resource schema",
    );
  }

  if (originalResource) {
    // Ensure that protected fields have not changed
    Object.keys(schema).forEach((field) => {
      if (
        // Field is a protected field
        schema[field].protected &&
        // Original value does not match new value
        originalResource[field] !== resource[field]
      ) {
        throw new ResourceValidationError(
          `[${resourceType}:${resource.id}] updating protected field '${field}' is forbiden`,
        );
      }
    });
  }

  try {
    // Validate the resource object
    validateObject({ type: 'object', schema: schemaWithId }, resource);
  } catch (error) {
    // Catch validation errors and re-throw them as a
    // `ResourceValidationError`, adding additional context.
    throw new ResourceValidationError(
      `[${resourceType}:${resource.id}] ${error.message}`,
    );
  }
}
