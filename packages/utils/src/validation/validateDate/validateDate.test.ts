import { InvalidValidatorError, ValidationError } from '../../errors';
import { DateValidator } from '../../types';
import { validateDate } from './validateDate';

const validator: DateValidator = {
  type: 'date',
};

describe('validateDate', () => {
  describe('invalid', () => {
    it('throws if the value is not a date', () => {
      // Validate an invalid date value. Should throw a `ValidationError`.
      expect(() => validateDate(validator, 1234)).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if value is a date', () => {
      // Validate a valid date value. Should not throw an error.
      expect(() => validateDate(validator, new Date())).not.toThrow();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a date validator', () => {
      // Call with a non-date validator. Should throw an
      // `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateDate({ type: 'string' }, new Date())).toThrowError(
        InvalidValidatorError,
      );
    });
  });
});
