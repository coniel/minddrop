import { RDDataSchema, RDSchema } from '../../types';

/**
 * Generate a resource document schema given the
 * resource's data schema.
 *
 * @param dataSchema The resource data schema.
 * @returns A resource document schema.
 */
export function generateResourceDocumentSchema<TData>(
  dataSchema: RDDataSchema<TData>,
): RDSchema<TData> {
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
