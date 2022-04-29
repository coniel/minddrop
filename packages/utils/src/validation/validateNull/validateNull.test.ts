import { InvalidValidatorError, ValidationError } from '../../errors';
import { validateNull } from './validateNull';

describe('validateNull', () => {
  describe('invalid', () => {
    it('throws if the value is not `null`', () => {
      // Validate a non-null value. Should throw a `ValidatinError`.
      expect(() => validateNull({ type: 'null' }, 123)).toThrowError(
        ValidationError,
      );
    });
  });

  describe('valid', () => {
    it('passes if the value is `null`', () => {
      // Validate a null value. Should not throw an error.
      expect(() => validateNull({ type: 'null' }, null)).not.toThrow();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a null validator', () => {
      // Call with a non-null validator
      // @ts-ignore
      expect(() => validateNull({ type: 'string' }, null)).toThrowError(
        InvalidValidatorError,
      );
    });
  });
});
