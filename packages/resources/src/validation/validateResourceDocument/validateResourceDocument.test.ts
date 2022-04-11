import { ResourceValidationError } from '../../errors';
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

  it('validates `protected` fields', () => {
    // Validate a object in which a protected field has changed.
    // Should throw a `ValidationError`.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', protected: true } },
        { ...document, foo: 'New value' },
        { ...document, foo: 'Old value' },
      ),
    ).toThrowError(ResourceValidationError);

    // Validate a object in which a protected field has not changed.
    // Should not throw an error.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', protected: true } },
        { ...document, foo: 'Old value' },
        { ...document, foo: 'Old value' },
      ),
    ).not.toThrow();

    // Validate a object whith a protected field without providing
    // an original object. Should not throw an error.
    expect(() =>
      validateResourceDocument<Data>(
        'test',
        { foo: { type: 'string', protected: true } },
        { ...document, foo: 'Old value' },
      ),
    ).not.toThrow();
  });

  it('rethrows a `ValidationError` as a `ResourceValidationError`', () => {
    // Validate an invalid resource, should throw a `ResourceValidationError`.
    expect(() =>
      // @ts-ignore
      validateResourceDocument<Data>('test', {}, { ...document, foo: 'foo' }),
    ).toThrowError(ResourceValidationError);
  });
});
