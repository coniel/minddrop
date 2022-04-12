import { InvalidResourceSchemaError } from '../../errors';
import { ResourceDataSchema } from '../../types';
import { generateResourceDocumentSchema } from './generateResourceDocumentSchema';

interface Data {
  foo: string;
}

const dataSchema: ResourceDataSchema<Data> = {
  foo: { type: 'string' },
};

describe('generateResourceDocumentSchema', () => {
  describe('invalid schema', () => {
    it('throws if the schema contains the `id` property', () => {
      // Generate a resource document using a schema which contains an `id`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', { id: { type: 'string' } }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `revision` property', () => {
      // Generate a resource document using a schema which contains an `revision`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', {
          revision: { type: 'string' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `createdAt` property', () => {
      // Generate a resource document using a schema which contains an `createdAt`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', {
          createdAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `updatedAt` property', () => {
      // Generate a resource document using a schema which contains an `updatedAt`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', {
          updatedAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `deleted` property', () => {
      // Generate a resource document using a schema which contains a `deleted`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', {
          deleted: { type: 'boolean' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `deletedAt` property', () => {
      // Generate a resource document using a schema which contains a `deletedAt`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema('test', {
          deletedAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });
  });

  it('returns a schema containing default field validators and data field validators', () => {
    // Generate a schema
    const schema = generateResourceDocumentSchema<Data>('test', dataSchema);

    // Returned schema should contain default field validators
    expect(schema.id).toBeDefined();
    // Returned schema should contain data field validators
    expect(schema.foo).toBeDefined();
  });
});
