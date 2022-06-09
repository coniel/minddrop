import { InvalidValidatorError, ValidationError } from '../../errors';
import { BooleanValidator } from '../../types';
import { validateBoolean } from './validateBoolean';

const validator: BooleanValidator = {
  type: 'boolean',
};

describe('validateBoolean', () => {
  describe('invalid', () => {
    it('throws if the value is not a boolean', () => {
      // Validate an invalid boolean value. Should throw a `ValidationError`.
      expect(() => validateBoolean(validator, 1)).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if value is a booean', () => {
      // Validate a valid boolean value. Should not throw an error.
      expect(() => validateBoolean(validator, true)).not.toThrow();
    });
  });

  describe('invalid validator', () => {
    it('throws if the validator is not a boolean validator', () => {
      // Call with non-boolean validator. Should throw a `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateBoolean({ type: 'string' }, true)).toThrowError(
        InvalidValidatorError,
      );
    });
  });
});
