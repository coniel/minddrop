import { InvalidParameterError } from '../../errors';
import { validateParameter } from './validateParameter';

describe('validateParamter', () => {
  describe('invalid', () => {
    it('throws if a required parameter is missing', () => {
      // Validate a required parameter with an undefined value.
      // Should throw a `InvalidParameterError`.
      expect(() => validateParameter({ type: 'string' }, 'foo')).toThrowError(
        InvalidParameterError,
      );
    });

    it('rethrows validation error as parameter error', () => {
      // Validate an invalid parameter. Should throw a
      // `InvalidParameterError`.
      expect(() =>
        validateParameter({ type: 'string' }, 'foo', 123),
      ).toThrowError(InvalidParameterError);
    });
  });

  describe('valid', () => {
    it('does not validate a non-required, empty value', () => {
      // Validate an optional string parameter which is
      // not provided. Should not throw an error.
      expect(() =>
        validateParameter({ type: 'string', required: false }, 'foo'),
      ).not.toThrow();
    });

    it('passes with a valid parameter', () => {
      // Validate a valid parameter. Should not throw
      // an error.
      expect(() =>
        validateParameter({ type: 'string' }, 'foo', 'foo'),
      ).not.toThrow();
    });
  });
});
