import { InvalidResourceSchemaError } from '../../errors';
import { ResourceDataSchema, ResourceDocumentSchema } from '../../types';

// The default resource document fields
const defaultFields = [
  'id',
  'revision',
  'createdAt',
  'updatedAt',
  'deleted',
  'deletedAt',
];

/**
 * Generate a resource document schema given the
 * resource's data schema.
 *
 * @param dataSchema The resource data schema.
 * @returns A resource document schema.
 */
export function generateResourceDocumentSchema<TData>(
  resource: string,
  dataSchema: ResourceDataSchema<TData>,
): ResourceDocumentSchema<TData> {
  // Ensure that the provided schema does not contain any
  // default resource document field validators.
  const schemaDefaultKeys = Object.keys(dataSchema).filter((key) =>
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

  // Merge the data schema with default field validators
  // to create the document schema.
  return {
    ...dataSchema,
    // Validate the `id` property
    id: {
      type: 'string',
      required: true,
      static: true,
    },
    // Validate the `revision` property
    revision: {
      type: 'string',
      required: true,
    },
    // Validate the `id` property
    createdAt: {
      type: 'date',
      required: true,
      static: true,
    },
    // Validate the `id` property
    updatedAt: {
      type: 'date',
      required: true,
    },
    deleted: {
      type: 'enum',
      options: [true],
    },
    deletedAt: {
      type: 'date',
      forbidenWithout: ['deleted'],
      requiredWith: ['deleted'],
    },
  };
}
