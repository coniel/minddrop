import { InvalidValidatorError, ValidationError } from '../../errors';
import * as ValidateValue from '../validateValue';
import { validateArray } from './validateArray';

const { validateValue } = ValidateValue;

jest.mock('../validateValue', () => ({
  validateValue: jest.fn(),
}));

interface CustomValidator {
  type: 'custom';
}

describe('validateArray', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws if the value is not an array', () => {
    // Validate an invalid arraym should throw a `ValidationError`
    expect(() =>
      // @ts-ignore
      validateArray(2, {
        type: 'array',
        items: { type: 'string' },
      }),
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

  it('does not throw if array is empty with `allowEmpty` set to true', () => {
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

  it('validates the array elements using the `items` validator', () => {
    // The item validator
    const itemValidator = { type: 'string' };

    // Validate an array with an `items` validator
    validateArray({ type: 'array', items: itemValidator }, ['foo']);

    // Should use `validateValue` to validate the array items
    expect(validateValue).toHaveBeenCalledWith(itemValidator, 'foo', undefined);
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

    // Should call `validateValue` with the custom validator and
    // custom validator functions.
    expect(validateValue).toHaveBeenCalledWith(
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

  it('rethrows item `ValidationError`s, adding additional context', () => {
    jest.spyOn(ValidateValue, 'validateValue').mockImplementationOnce(() => {
      throw new ValidationError('error message');
    });

    // Validate an array with an invalid item. Should rethrow the thrown
    // `ValidationError`, add context to it.
    try {
      validateArray({ type: 'array', items: { type: 'string' } }, [1]);
    } catch (error) {
      // Error message should differ from the thrown error
      expect(error.message).not.toBe('error message');
    }
  });

  it('rethrows other item validation errors as is', () => {
    jest.spyOn(ValidateValue, 'validateValue').mockImplementationOnce(() => {
      throw new InvalidValidatorError('error message');
    });

    // Validate an array with an invalid item. Should not rethrow the
    // thrown `InvalidValidatorError`.
    try {
      validateArray({ type: 'array', items: { type: 'string' } }, [1]);
    } catch (error) {
      // Error message should not be modified
      expect(error.message).toBe('error message');
    }
  });
});
