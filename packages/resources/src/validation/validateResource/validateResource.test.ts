import {
  InvalidResourceSchemaError,
  ResourceValidationError,
} from '../../errors';
import { validateValue } from '../validateValue';
import { validateResource } from './validateResource';

jest.mock('../validateValue', () => ({
  validateValue: jest.fn(),
}));

describe('validateResource', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invalid schema', () => {
    it('throws if the schema contains the `id` property', () => {
      // Validate a resource using a schema which contains an `id`
      // field validator. Should throw a `InvalidResourceSchemaError`.
      expect(() =>
        validateResource('test', { id: { type: 'number' } }, { id: 'id' }),
      ).toThrowError(InvalidResourceSchemaError);
    });
  });

  it('validates the `id` field', () => {
    // Validate a resource with a schema which does not contain an
    // `id` validator.
    validateResource('test', {}, { id: 'id' });

    // Should validate the `id` anyway.
    expect(validateValue).toHaveBeenCalled();
  });

  it('rethrows a `ValidationError` as a `ResourceValidationError`', () => {
    // Validate an invalid resource, should throw a `ResourceValidationError`.
    expect(() =>
      validateResource('test', {}, { id: 'id', foo: 'foo' }),
    ).toThrowError(ResourceValidationError);
  });

  it('validates `protected` fields', () => {
    // Validate a object in which a protected field has changed.
    // Should throw a `ValidationError`.
    expect(() =>
      validateResource(
        'test',
        { foo: { type: 'string', protected: true } },
        { id: 'id', foo: 'New value' },
        { id: 'id', foo: 'Old value' },
      ),
    ).toThrowError(ResourceValidationError);

    // Validate a object in which a protected field has not changed.
    // Should not throw an error.
    expect(() =>
      validateResource(
        'test',
        { foo: { type: 'string', protected: true } },
        { id: 'id', foo: 'Old value' },
        { id: 'id', foo: 'Old value' },
      ),
    ).not.toThrow();

    // Validate a object whith a protected field without providing
    // an original object. Should not throw an error.
    expect(() =>
      validateResource(
        'test',
        { foo: { type: 'string', protected: true } },
        { id: 'id', foo: 'Old value' },
      ),
    ).not.toThrow();
  });
});
