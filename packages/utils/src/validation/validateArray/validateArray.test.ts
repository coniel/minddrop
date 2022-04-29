import { InvalidValidatorError, ValidationError } from '../../errors';
import { BaseValidator } from '../../types';
import { validateArray } from './validateArray';

interface CustomValidator extends BaseValidator {
  type: 'custom';
}

describe('validateArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('array validation', () => {
    it('throws if the value is not an array', () => {
      // Validate an invalid arraym should throw a `ValidationError`
      expect(() =>
        validateArray(
          {
            type: 'array',
            items: { type: 'string' },
          },
          2,
        ),
      ).toThrowError(ValidationError);
    });

    it('throws if array is empty with `allowEmpty` set to false', () => {
      // Validate an empty array with `allowEmpty` set to false, should
      // throw a `ValidationError`.
      expect(() =>
        validateArray(
          {
            type: 'array',
            allowEmpty: false,
            items: { type: 'string' },
          },
          [],
        ),
      ).toThrowError(ValidationError);
    });
  });

  describe('item validation', () => {
    it('validates the array elements using the `items` validator', () => {
      // Validate an array containing an invalid value using the `items`
      // option. Should throw a `ValidationError`.
      expect(() =>
        validateArray({ type: 'array', items: { type: 'number' } }, ['foo']),
      ).toThrowError(ValidationError);
    });

    it('validates the array elements using a custom validator', () => {
      // The custom item validator
      const customValidator: CustomValidator = { type: 'custom' };
      // The custom validator functions
      const customValidatorFns = { custom: jest.fn() };

      // Validate an array with a custom `items` validator
      validateArray(
        { type: 'array', items: customValidator },
        ['foo'],
        customValidatorFns,
      );

      // Should call the custom validator function
      expect(customValidatorFns.custom).toHaveBeenCalledWith(
        customValidator,
        'foo',
        customValidatorFns,
      );
    });

    it('validates the array elements using the `itemValidatorFn`', () => {
      // The validator function
      const itemValidatorFn = jest.fn();

      // Validate an array with a `itemValidatorFn` provided in the validator.
      // Should call `itemValidatorFn` on each array element.
      validateArray(
        {
          type: 'array',
          itemValidatorFn,
        },
        ['hello', 'world'],
      );

      // Should call the function on each array item
      expect(itemValidatorFn).toHaveBeenCalledTimes(2);
      // Should call the function with the item value
      expect(itemValidatorFn).toHaveBeenCalledWith('hello');
    });
  });

  describe('error handling', () => {
    it('rethrows items validator errors, adding additional context', () => {
      // Validate an array using the `validateValue` implementation that
      // will throw a `ValidationError` error. Should rethrow the error
      // wtih customised text.
      try {
        validateArray(
          {
            type: 'array',
            items: { type: 'string' },
          },
          [1],
        );
      } catch (error) {
        // Error should be a `ValidationError`
        expect(error instanceof ValidationError).toBeTruthy();
        // Error message should differ from the thrown error
        expect(error.message).not.toBe('error message');
      }
    });

    it('rethrows itemValidatorFn `ValidationError`, adding additional context', () => {
      // Validate an array using a `itemValidatorFn` that throws a `ValidationError`
      // error. Should rethrow the error wtih customised text.
      try {
        validateArray(
          {
            type: 'array',
            itemValidatorFn: () => {
              throw new ValidationError('error message');
            },
          },
          [1],
        );
      } catch (error) {
        // Error should be a `ValidationError`
        expect(error instanceof ValidationError).toBeTruthy();
        // Error message should differ from the thrown error
        expect(error.message).not.toBe('error message');
      }
    });

    it('rethrows other item validation errors as is', () => {
      // Validate an array using a `itemValidatorFn` that throws a random error.
      // Should rethrow the error as is.
      try {
        validateArray(
          {
            type: 'array',
            itemValidatorFn: () => {
              throw new Error('error message');
            },
          },
          [1],
        );
      } catch (error) {
        // Error message should not be modified
        expect(error.message).toBe('error message');
      }
    });
  });

  describe('valid', () => {
    it('passes given a valid array', () => {
      // Validate a valid array. Should not throw an error.
      expect(() =>
        validateArray({ type: 'array', items: { type: 'string' } }, [
          'hello',
          'world',
        ]),
      );
    });

    it('passes given a valid multi-type array', () => {
      // Validate a valid array which allows for multiple types.
      // Should not throw an error.
      expect(() =>
        validateArray(
          {
            type: 'array',
            items: { type: [{ type: 'string' }, { type: 'number' }] },
          },
          ['hello', 1234],
        ),
      );
    });

    it('passes if array is empty with `allowEmpty` set to true', () => {
      // Validate an empty array with `allowEmpty` set to true, should
      // not throw an error.
      expect(() =>
        validateArray(
          {
            type: 'array',
            allowEmpty: true,
            items: { type: 'string' },
          },
          [],
        ),
      ).not.toThrow();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not an array validator', () => {
      // Call with non-array validator. Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateArray({ type: 'string', items: { type: 'string' } }, true),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if the validator contains neither `items` nor `itemValidatorFn`', () => {
      // Validate an array using an invalid validator which has neither a `items`
      // validator, not a `itemValidatorFn`. Should throw an `InvalidValidatorError`.
      expect(() =>
        validateArray(
          {
            type: 'array',
          },
          ['hello'],
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `items` is not a validator', () => {
      // Validate an array using a validtor with an invalid `items` option.
      // Should throw a `InvalidValidator` error.
      expect(() =>
        // @ts-ignore
        validateArray({ type: 'array', items: 'string' }, ['hello']),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `itemValidatorFn` is not a function', () => {
      // Validate an array using a validator with an invalid `itemValidatorFn`
      // option. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateArray(
          // @ts-ignore
          { type: 'array', itemValidatorFn: 'is a number ? pass : fail' },
          [1234],
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowEmpty` is not a boolean', () => {
      // Validate an array using a validator with an invalid `allowEmpty`
      // option. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateArray(
          {
            type: 'array',
            items: { type: 'string' },
            // @ts-ignore
            allowEmpty: 'sure',
          },
          [],
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
