import { InvalidResourceSchemaError } from '../errors';
import { validateTypedResourceDataSchema } from './validateTypedResourceDataSchema';

describe('validateTypedResourceDataSchema', () => {
  it('throws if the schema contains a `type` validator', () => {
    // Validate a schema containing a `type` validator.
    // Should throw a `InvalidResourceSchemaError`.
    expect(() =>
      validateTypedResourceDataSchema(
        'test',
        // @ts-ignore
        { type: { type: 'string' } },
      ),
    ).toThrowError(InvalidResourceSchemaError);
  });

  it('throws if a validator is invalid', () => {
    // Validate an invalid schema. Should throw
    // an `InvalidResourceSchemaError`.
    expect(() =>
      validateTypedResourceDataSchema('test', {
        // @ts-ignore
        foo: {},
      }),
    ).toThrowError(InvalidResourceSchemaError);
  });

  it('skips base validation when `skipBaseValidation` is true', () => {
    // Validate an invalid schema with `skipBaseValidation`
    // set to true. Should not throw an error.
    expect(() =>
      validateTypedResourceDataSchema(
        'test',
        {
          // @ts-ignore
          foo: {},
        },
        true,
      ),
    ).not.toThrow();
  });
});
