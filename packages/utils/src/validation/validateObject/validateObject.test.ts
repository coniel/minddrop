import {
  InvalidSchemaError,
  InvalidValidatorError,
  ValidationError,
} from '../../errors';
import { StringValidator } from '../../types';
import * as ValidateValue from '../validateValue';
import { validateObject } from './validateObject';

const { validateValue } = ValidateValue;

jest.mock('../validateValue', () => ({
  validateValue: jest.fn(),
}));

describe('validateResource', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('all fields', () => {
    it('throws if a object field does not appear in the schema', () => {
      // Validate a object containing a field which does not appear
      // in the schema, Should throw a `ValidationError`.
      expect(() =>
        validateObject(
          { type: 'object', schema: {} },
          { title: 'Hello world' },
        ),
      ).toThrowError(ValidationError);
    });

    it('validates `required` fields', () => {
      // Validate a object missing a required field.
      // Should throw a `ValidationError`.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: { title: { type: 'string', required: true } },
          },
          {},
        ),
      ).toThrowError(ValidationError);

      // Validate a object a required field which is present.
      // Should not throw an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: { title: { type: 'string', required: true } },
          },
          { title: 'Hello world' },
        ),
      ).not.toThrow();

      // Validate a object missing an optional field.
      // Should not throw an error.
      expect(() =>
        validateObject(
          { type: 'object', schema: { title: { type: 'string' } } },
          {},
        ),
      ).not.toThrow();
    });

    it('validates `requiredWith` fields', () => {
      // Validate a object missing a field which is required when
      // another (present) field is present. Should throw a
      // `ValidationError`.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', requiredWith: ['deleted'] },
            },
          },
          { deleted: true },
        ),
      ).toThrowError(ValidationError);

      // Validate a object containing a field which is required when
      // another (present) field is present. Should not throw an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', requiredWith: ['deleted'] },
            },
          },
          { deleted: true, deletedAt: new Date() },
        ),
      ).not.toThrow();

      // Validate a object missing a field which is required when
      // another (also missing) field is present. Should not throw
      // an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', requiredWith: ['deleted'] },
            },
          },
          {},
        ),
      ).not.toThrow();
    });

    it('validates `requiredWithout` fields', () => {
      // Validate a object missing a field which is required when
      // another (also missing) field is not present. Should throw a
      // `ValidationError`.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              parent: { type: 'string' },
              deleted: {
                type: 'enum',
                options: [true],
                requiredWithout: ['parent'],
              },
            },
          },
          {},
        ),
      ).toThrowError(ValidationError);

      // Validate a object missing a field which is required when
      // another (present) field is not present. Should not throw an
      // error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              parent: { type: 'string' },
              deleted: {
                type: 'enum',
                options: [true],
                requiredWithout: ['parent'],
              },
            },
          },
          { parent: 'parent-id' },
        ),
      ).not.toThrow();

      // Validate a object containing field which is required when
      // another (missing) field is not present. Should not throw an
      // error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              parent: { type: 'string' },
              deleted: {
                type: 'enum',
                options: [true],
                requiredWithout: ['parent'],
              },
            },
          },
          { deleted: true },
        ),
      ).not.toThrow();
    });

    it('validates `forbidenWith` fields', () => {
      // Validate a object containing a field which is forbiden when
      // another (present) field is present. Should throw a
      // `ValidationError`.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: {
                type: 'enum',
                options: [true],
                forbidenWith: ['active'],
              },
              active: { type: 'enum', options: [true] },
            },
          },
          { deleted: true, active: true },
        ),
      ).toThrowError(ValidationError);

      // Validate a object containing a field which is forbiden when
      // another (missing) field is present. Should not throw an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: {
                type: 'enum',
                options: [true],
                forbidenWith: ['active'],
              },
              active: { type: 'enum', options: [true] },
            },
          },
          { deleted: true },
        ),
      ).not.toThrow();

      // Validate a object missing a field which is forbiden when
      // another (also missing) field is present. Should not throw
      // an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: {
                type: 'enum',
                options: [true],
                forbidenWith: ['active'],
              },
              active: { type: 'enum', options: [true] },
            },
          },
          {},
        ),
      ).not.toThrow();
    });

    it('validates `forbidenWithout` fields', () => {
      // Validate a object containing a field which is forbiden when
      // another (missing) field is not present. Should throw a
      // `ValidationError`.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', forbidenWithout: ['deleted'] },
            },
          },
          { deletedAt: new Date() },
        ),
      ).toThrowError(ValidationError);

      // Validate a object containing a field which is forbidden when
      // another (present) field is not present. Should not throw an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', forbidenWithout: ['deleted'] },
            },
          },
          { deleted: true, deletedAt: new Date() },
        ),
      ).not.toThrow();

      // Validate a object missing a field which is forbiden when
      // another (also missing) field is not present. Should not throw
      // an error.
      expect(() =>
        validateObject(
          {
            type: 'object',
            schema: {
              deleted: { type: 'enum', options: [true] },
              deletedAt: { type: 'date', forbidenWithout: ['deleted'] },
            },
          },
          {},
        ),
      ).not.toThrow();
    });
  });

  describe('field scpecific validation', () => {
    it('validates fields using `validateValue`', () => {
      // The field validator
      const fieldValidator: StringValidator = { type: 'string' };
      // Validate a object containing a string field.
      validateObject(
        { type: 'object', schema: { title: fieldValidator } },
        { title: 'Hello world' },
      );

      // Should use `validateValue` to validate it.
      expect(validateValue).toHaveBeenCalledWith(
        fieldValidator,
        'Hello world',
        undefined,
      );
    });

    it('validates fields using a custom validator', () => {
      // The custom item validator
      const customValidator = { type: 'custom' };
      // The custom validator functions
      const customValidatorFns = { custom: jest.fn() };

      // Validate an array with a custom `items` validator
      validateObject(
        { type: 'object', schema: { foo: customValidator } },
        { foo: 'foo' },
        customValidatorFns,
      );

      // Should call `validateValue` with the custom validator and
      // custom validator functions.
      expect(validateValue).toHaveBeenCalledWith(
        customValidator,
        'foo',
        customValidatorFns,
      );
    });

    it("validates using the validator's `validationFn", () => {
      // The validatorFn
      const validatorFn = jest.fn();

      // Validate an object using a validator which contains a `validatorFn`.
      validateObject(
        { type: 'object', schema: { title: { type: 'string', validatorFn } } },
        { title: 'Hello world' },
      );

      // Should call the `validatorFn`.
      expect(validatorFn).toHaveBeenCalled();
    });

    it('rethrows item `ValidationError`s, adding additional context', () => {
      jest.spyOn(ValidateValue, 'validateValue').mockImplementation(() => {
        throw new ValidationError('error message');
      });

      // Validate an object containing an invalid value. Should add context to
      // the rethrown `ValidationError`.
      try {
        validateObject(
          { type: 'object', schema: { foo: { type: 'string' } } },
          { foo: 1 },
        );
      } catch (error) {
        // Should rethrow a `ValidationError`
        expect(error instanceof ValidationError).toBeTruthy();
        // Error message should differ from the thrown error
        expect(error.message).not.toBe('error message');
      }
    });

    it('rethrows `InvalidValidatorError`s, adding additional context', () => {
      jest.spyOn(ValidateValue, 'validateValue').mockImplementation(() => {
        throw new InvalidValidatorError('error message');
      });

      // Validate an object using a schema with an invalid validator.
      // Should rethrow the thrown `InvalidValidatorError` as a
      // `InvalidSchemaError` with additional context.
      try {
        validateObject(
          { type: 'object', schema: { foo: { type: 'string' } } },
          { foo: 1 },
        );
      } catch (error) {
        // Error should be an `InvalidSchemaError`
        expect(error instanceof InvalidSchemaError).toBeTruthy();
        // Error message should differ from the thrown error
        expect(error.message).not.toBe('error message');
      }
    });

    it('rethrows other item validation errors as is', () => {
      jest.spyOn(ValidateValue, 'validateValue').mockImplementation(() => {
        throw new Error('error message');
      });

      // Throw a random error during validation. Should be rethrown as is.
      try {
        validateObject(
          { type: 'object', schema: { foo: { type: 'string' } } },
          { foo: 'foo' },
        );
      } catch (error) {
        // Error message should not be modified
        expect(error.message).toBe('error message');
      }
    });
  });
});
