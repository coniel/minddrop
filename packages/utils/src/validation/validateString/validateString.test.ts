import { InvalidValidatorError, ValidationError } from '../../errors';
import { StringValidator } from '../../types';
import { validateString } from './validateString';

const validator: StringValidator = {
  type: 'string',
};

describe('validateString', () => {
  describe('invalid', () => {
    it('throws if the value is not a string', () => {
      // Validate an invalid string. Should throw a `ValidationError`.
      expect(() => validateString(validator, 2)).toThrowError(ValidationError);
    });

    it('throws if string is empty with a falsy `allowEmpty`', () => {
      // Validate an empty string with `allowEmpty` set to false.
      // Should throw a `ValidationError`.
      expect(() => validateString(validator, '')).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if string is a valid string', () => {
      // Validate a valid string. Should not throw an error.
      expect(() => validateString(validator, 'Hello world')).not.toThrow();
    });

    it('passes if string is empty with `allowEmpty` set to true', () => {
      // Validate an empty string with `allowEmpty` set to true.
      // Should not throw an error.
      expect(() =>
        validateString({ ...validator, allowEmpty: true }, ''),
      ).not.toThrow();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a string validator', () => {
      // Call with a non-string validator. Should throw a
      // `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateString({ type: 'number' }, ['red']),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowEmpty` is not a boolean', () => {
      // Validate a string using a validator with an invalid `allowEmpty`
      // option. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateString(
          {
            type: 'string',
            // @ts-ignore
            allowEmpty: 'sure',
          },
          'hello',
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
