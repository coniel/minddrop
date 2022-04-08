import { InvalidValidatorError, ValidationError } from '../../errors';
import { NumberFieldValidator } from '../../types';
import { validateNumber } from './validateNumber';

const validator: NumberFieldValidator = {
  type: 'number',
};

describe('validateNumber', () => {
  describe('invalid', () => {
    it('throws if the value is not a number', () => {
      // Validate an invalid number. Should throw a `ValidationError`.
      expect(() => validateNumber(validator, '2')).toThrowError(
        ValidationError,
      );
    });

    it('throws if number is less than `min`', () => {
      // Validate a number which is less than the `min` value set
      // in the validator. Should throw a `ValidationError`.
      expect(() => validateNumber({ ...validator, min: 2 }, 1)).toThrowError(
        ValidationError,
      );
    });

    it('throws if number is greater than `max`', () => {
      // Validate a number which is greater than the `max` value set
      // in the validator. Should throw a `ValidationError`.
      expect(() => validateNumber({ ...validator, max: 2 }, 3)).toThrowError(
        ValidationError,
      );
    });
  });

  describe('valid', () => {
    it('passes if number is a valid number', () => {
      // Validate a valid number. Should not throw an error.
      expect(() => validateNumber(validator, 2)).not.toThrow();
    });

    it('passes if number is equal to `min`', () => {
      // Validate a number equal to `min`. Should not throw an error.
      expect(() => validateNumber({ ...validator, min: 2 }, 2)).not.toThrow();
    });

    it('passes if number is equal to `max`', () => {
      // Validate a number equal to `max`. Should not throw an error.
      expect(() => validateNumber({ ...validator, max: 2 }, 2)).not.toThrow();
    });

    it('passes if number is between `min` and `max` range', () => {
      // Validate a number greated than `min` and less than `max`.
      // Should not throw an error.
      expect(() =>
        validateNumber({ ...validator, min: 0, max: 2 }, 1),
      ).not.toThrow();
    });
  });

  describe('invalid validator', () => {
    it('throws if `min` is set to anything but a number', () => {
      // Validate a number using a validator in which `min` is set to
      // a string. Should throw a `InvalidValidationError`.
      expect(() =>
        // @ts-ignore
        validateNumber({ type: 'number', min: '1' }, 1),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `max` is set to anything but a number', () => {
      // Validate a number using a validator in which `max` is set to
      // a string. Should throw a `InvalidValidationError`.
      expect(() =>
        // @ts-ignore
        validateNumber({ type: 'number', max: '1' }, 1),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws is `min` is greater than `max`', () => {
      // Validate a number using a validator in which the `min` value
      // is set to a larger number than the `max` value. Should throw
      // a `InvalidValidatorError`.
      expect(() =>
        validateNumber({ type: 'number', min: 2, max: 1 }, 2),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
