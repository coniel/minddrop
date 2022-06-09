import { validateResourceDataSchema } from './validateResourceDataSchema';
import { InvalidResourceSchemaError } from '../../errors';
import { RDDataSchema } from '../../types';

interface Data {
  foo?: string;
}

const schema: RDDataSchema<Data> = {
  foo: {
    type: 'string',
    // Ensure core field options work
    required: true,
    // Ensure resource field options work
    static: true,
  },
};

describe('validateResourceDataSchema', () => {
  describe('invalid', () => {
    it('throws if the schema contains the `id` property', () => {
      // Validate a schema which contains an `id` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', { id: { type: 'string' } }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `revision` property', () => {
      // Validate a schema which contains an `revision` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', {
          revision: { type: 'string' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `createdAt` property', () => {
      // Validate a schema which contains an `createdAt` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', {
          createdAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `updatedAt` property', () => {
      // Validate a schema which contains an `updatedAt` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', {
          updatedAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `deleted` property', () => {
      // Validate a schema which contains a `deleted` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', {
          deleted: { type: 'boolean' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains the `deletedAt` property', () => {
      // Validate a schema which contains a `deletedAt` field validator.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', {
          deletedAt: { type: 'date' },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if a core validator type is invalid', () => {
      // Validate a schema containig an invalid core validator type.
      // Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          // @ts-ignore
          foo: { type: 'string', allowEmpty: 1 },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains a disallowed validator type', () => {
      // Validate a schema containing a validator not listed in the allowed types.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        // @ts-ignore
        validateResourceDataSchema('test', { foo: { type: 'function' } }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains an invalid `content-color` validator', () => {
      // Validate a schema containing an invalid `content-color` type validator.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          foo: {
            type: 'content-color',
            // @ts-ignore
            allowedColors: ['invalid'],
          },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains an invalid `resource-id` validator', () => {
      // Validate a schema containing an invalid `resource-id` type validator.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          foo: {
            type: 'resource-id',
            // @ts-ignore
            resource: '',
          },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains an invalid `resource-ids` validator', () => {
      // Validate a schema containing an invalid `resource-ids` type validator.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          foo: {
            type: 'resource-ids',
            // @ts-ignore
            resource: '',
          },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains an invalid `resource-reference` validator', () => {
      // Validate a schema containing an invalid `resource-reference` type validator.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          foo: {
            type: 'resource-reference',
            // @ts-ignore
            extraProperty: 'foo',
          },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });

    it('throws if the schema contains an invalid `resource-references` validator', () => {
      // Validate a schema containing an invalid `resource-references` type validator.
      // Should throw an `InvalidResourceSchemaError`.
      expect(() =>
        validateResourceDataSchema('test', {
          foo: {
            type: 'resource-references',
            // @ts-ignore
            allowEmpty: 1,
          },
        }),
      ).toThrowError(InvalidResourceSchemaError);
    });
  });

  it('passes if the schema is valid', () => {
    // Validate a valid schema. Should not throw an error.
    expect(() => validateResourceDataSchema('test', schema)).not.toThrow();
  });
});
