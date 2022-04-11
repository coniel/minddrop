import { InvalidSchemaError } from '@minddrop/utils';
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
      // field validator. Should throw a `InvalidSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema({ id: { type: 'string' } }),
      ).toThrowError(InvalidSchemaError);
    });

    it('throws if the schema contains the `revision` property', () => {
      // Generate a resource document using a schema which contains an `revision`
      // field validator. Should throw a `InvalidSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema({ revision: { type: 'string' } }),
      ).toThrowError(InvalidSchemaError);
    });

    it('throws if the schema contains the `createdAt` property', () => {
      // Generate a resource document using a schema which contains an `createdAt`
      // field validator. Should throw a `InvalidSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema({ createdAt: { type: 'date' } }),
      ).toThrowError(InvalidSchemaError);
    });

    it('throws if the schema contains the `updatedAt` property', () => {
      // Generate a resource document using a schema which contains an `updatedAt`
      // field validator. Should throw a `InvalidSchemaError`.
      expect(() =>
        // @ts-ignore
        generateResourceDocumentSchema({ updatedAt: { type: 'date' } }),
      ).toThrowError(InvalidSchemaError);
    });
  });

  it('returns a schema containing default field validators and data field validators', () => {
    // Generate a schema
    const schema = generateResourceDocumentSchema<Data>(dataSchema);

    // Returned schema should contain default field validators
    expect(schema.id).toBeDefined();
    // Returned schema should contain data field validators
    expect(schema.foo).toBeDefined();
  });
});
