import { ValidationError } from '../../errors';
import { StringFieldValidator } from '../../types';
import { validateString } from './validateString';

const validator: StringFieldValidator = {
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
});
