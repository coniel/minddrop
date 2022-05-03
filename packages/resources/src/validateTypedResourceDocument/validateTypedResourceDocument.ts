import {
  TypedResourceBaseDocumentDataSchema,
  TypedResourceTypeDocumentDataSchema,
  TypedResourceDocument,
  TypedResourceDocumentDataSchema,
} from '../types';
import { validateResourceDocument } from '../validation';

/**
 * Validates a typed resource document against its base and type scpecific
 * data schemas as well as default typed resource document properties.
 *
 * @param resource - The resource identifier.
 * @param dataSchema - The resource data schema.
 * @param document - The document to validate.
 * @param originalDocument - The original document against which to validate (when validating an update).
 *
 * @throws ResourceValidationError
 * Thrown if the resource document is invalid.
 *
 * @throws InvalidSchemaError
 * Thrown if the resource data schema is invalid.
 */
export function validateTypedResourceDocument<TBaseData, TTypeData>(
  resource: string,
  baseDataSchema: TypedResourceBaseDocumentDataSchema<TBaseData>,
  typeDataSchema: TypedResourceTypeDocumentDataSchema<TBaseData, TTypeData>,
  document: TypedResourceDocument<TBaseData, TTypeData>,
  originalDocument?: object,
): void {
  // Merge the base resource custom data schema and the type
  // specific data schema, to create the resource document's
  // custom data schema.
  const customDataSchema: TypedResourceDocumentDataSchema<
    TBaseData,
    TTypeData
  > = {
    ...baseDataSchema,
    ...typeDataSchema,
  };

  // Validate the document, adding a `type` field validator
  validateResourceDocument(
    resource,
    {
      ...customDataSchema,
      type: {
        type: 'string',
        required: true,
        allowEmpty: false,
      },
    },
    document,
    originalDocument,
  );
}
