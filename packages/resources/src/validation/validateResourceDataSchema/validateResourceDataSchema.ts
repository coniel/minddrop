import { validateValue, SchemaValidator } from '@minddrop/utils';
import { RDDataSchema, RDData } from '../../types';
import { InvalidResourceSchemaError } from '../../errors';
import { ContentColorValidatorOptionsSchema } from '../validateContentColor';
import { ResourceIdValidatorOptionsSchema } from '../validateResourceId';
import { ResourceIdsValidatorOptionsSchema } from '../validateResourceIds';
import { ResourceReferencesValidatorOptionsSchema } from '../validateResourceReferences';

// The default resource document fields
const defaultFields = [
  'id',
  'revision',
  'createdAt',
  'updatedAt',
  'deleted',
  'deletedAt',
];

// The field types allowed in the resource data
const allowedDataTypes = [
  'string',
  'number',
  'boolean',
  'set',
  'enum',
  'date',
  'array',
  'object',
  'record',
  'content-color',
  'resource-id',
  'resource-ids',
  'resource-reference',
  'resource-references',
];

/**
 * Validates a resource's data schema.
 *
 * @param resource - The resource name.
 * @param schema - The resource data schema.
 *
 * @throws InvalidResourceSchemaError
 * Thrown if the schema is invalid.
 */
export function validateResourceDataSchema<TData extends RDData>(
  resource: string,
  schema: RDDataSchema<TData>,
): void {
  // Ensure that the provided schema does not contain any
  // default resource document field validators.
  const schemaDefaultKeys = Object.keys(schema).filter((key) =>
    defaultFields.includes(key),
  );

  if (schemaDefaultKeys.length) {
    // Throw an `InvalidSchemaError` if the data schema contains
    // any default resource field validators.
    throw new InvalidResourceSchemaError(
      `[${resource}] ${
        schemaDefaultKeys.length > 1 ? 'properties' : 'property'
      } '${schemaDefaultKeys.join("', '")}' ${
        schemaDefaultKeys.length > 1 ? 'are' : 'is'
      } validated automatically and should not be inlcuded in the resource's data schema`,
    );
  }

  try {
    // Validate the schema
    validateValue<SchemaValidator>(
      {
        type: 'schema',
        allowedTypes: allowedDataTypes,
        customFieldOptions: {
          static: { type: 'boolean', required: false },
        },
        validatorOptionsSchemas: {
          'content-color': ContentColorValidatorOptionsSchema,
          'resource-id': ResourceIdValidatorOptionsSchema,
          'resource-ids': ResourceIdsValidatorOptionsSchema,
          'resource-references': ResourceReferencesValidatorOptionsSchema,
        },
      },
      schema,
    );
  } catch (error) {
    throw new InvalidResourceSchemaError(error.message);
  }
}
