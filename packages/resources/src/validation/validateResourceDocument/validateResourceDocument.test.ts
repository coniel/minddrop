import { ContentColor } from '@minddrop/core';
import {
  InvalidResourceSchemaError,
  ResourceValidationError,
} from '../../errors';
import { generateResourceDocument } from '../../generateResourceDocument';
import { ResourceDataSchema } from '../../types';
import { validateResourceDocument } from './validateResourceDocument';

interface Data {
  foo?: string;
}

const document = generateResourceDocument<Data>({ foo: 'foo' });

const dataSchema: ResourceDataSchema<Data> = {
  foo: { type: 'string', allowEmpty: false },
};

describe('validateResource', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates default resource document fields', () => {
    // Validate a document containing an invalid `id` field. Should
    // throw a `ResourceValidatiorError`.
    expect(() =>
      validateResourceDocument('test', dataSchema, { ...document, id: '' }),
    ).toThrowError(ResourceValidationError);
  });

  it('validates data fields', () => {
    // Validate a document with containing an invalid data field. Should
    // throw a `ResourceValidationError`.
    expect(() =>
      validateResourceDocument('test', dataSchema, { ...document, foo: '' }),
    ).toThrowError(ResourceValidationError);
  });

  it('validates `content-color` fields', () => {
    // Validate a document contaning an invalid content-color value.
    // Should throw a `ResourceValidatiorError`.
    expect(() =>
      validateResourceDocument<{ color: ContentColor }>(
        'test',
        {
          color: { type: 'content-color', allowedColors: ['red', 'green'] },
        },
        {
          ...document,
          color: 'blue',
        },
      ),
    );
  });

  it('validates `static` fields', () => {
    // Validate a object in which a static field has changed.
    // Should throw a `ValidationError`.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', static: true } },
        { ...document, foo: 'New value' },
        { ...document, foo: 'Old value' },
      ),
    ).toThrowError(ResourceValidationError);

    // Validate a object in which a static field has not changed.
    // Should not throw an error.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', static: true } },
        { ...document, foo: 'Old value' },
        { ...document, foo: 'Old value' },
      ),
    ).not.toThrow();

    // Validate a object whith a static field without providing
    // an original object. Should not throw an error.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', static: true } },
        { ...document, foo: 'Old value' },
      ),
    ).not.toThrow();
  });

  it('rethrows a `ValidationError` as a `ResourceValidationError`', () => {
    // Validate an invalid resource. Should throw a `ResourceValidationError`.
    expect(() =>
      // @ts-ignore
      validateResourceDocument<Data>('test', {}, { ...document, foo: 'foo' }),
    ).toThrowError(ResourceValidationError);
  });

  it('rethrows a `InvalidSchemaError` as a `InvalidResourceSchemaError`', () => {
    // Validate a resource using an invalid schema. Should throw a
    // `InvalidResourceSchemaError`.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        // @ts-ignore
        { foo: { type: 'invalid' } },
        document,
      ),
    ).toThrowError(InvalidResourceSchemaError);
  });

  it('rethrows other errors as they are', () => {
    // Validate a resource using a validator which throws a random error.
    // Should rethrow the error as is.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        {
          foo: {
            type: 'string',
            validatorFn: () => {
              throw new Error('error');
            },
          },
        },
        document,
      ),
    ).toThrowError(Error);
  });
});
