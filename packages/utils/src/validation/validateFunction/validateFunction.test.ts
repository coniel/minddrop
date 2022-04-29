import { InvalidValidatorError, ValidationError } from '../../errors';
import { validateFunction } from './validateFunction';

describe('validateFunction', () => {
  describe('invalid', () => {
    it('throws if the value is not a function', () => {
      // Validate a value which is not a function. Should throw
      // a `ValidationError`.
      expect(() => validateFunction({ type: 'function' }, {})).toThrowError(
        ValidationError,
      );
    });
  });

  describe('valid', () => {
    it('passes if the value is a function', () => {
      // Validate a value which is a function. Should not throw
      // an error.
      expect(() =>
        validateFunction({ type: 'function' }, () => null),
      ).not.toThrow();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not an function validator', () => {
      // Call with a non-function validator. Should throw a
      // `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateFunction({ type: 'string' }, () => null),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
