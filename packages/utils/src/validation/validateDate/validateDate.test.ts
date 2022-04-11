import { ValidationError } from '../../errors';
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
});
