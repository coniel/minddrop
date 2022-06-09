import { InvalidValidatorError, ValidationError } from '../../errors';
import { validateEnum } from './validateEnum';

describe('validateEnum', () => {
  describe('invalid', () => {
    it('throws if the value is not lised in the options', () => {
      // Validate an enum for which the value is not listed in the
      // validator's options. Should throw a `ValidationError`.
      expect(() =>
        validateEnum({ type: 'enum', options: ['red', 'blue'] }, 'purple'),
      ).toThrowError(ValidationError);
    });

    it('throws if the value is undefined', () => {
      // Validate an enum for which the value is undefined. Should
      // throws a `ValidationError`.
      expect(() =>
        validateEnum({ type: 'enum', options: ['red', 'blue'] }, undefined),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if the value is listed in the options', () => {
      // Validate an enum for which the value is listed in
      // the validator's options. Should not throw an error.
      expect(() =>
        validateEnum({ type: 'enum', options: ['red', 'blue'] }, 'red'),
      ).not.toThrow();
    });

    it('supports `null` as an option', () => {
      // Validate an enum for which the validator's options contains
      // `null`. Should not throw a `InvalidValidatorError` error.
      expect(() =>
        // @ts-ignore
        validateEnum({ type: 'enum', options: ['red', null] }, null),
      ).not.toThrowError(InvalidValidatorError);
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not an enum validator', () => {
      // Call with a non-enum validator. Should throw a
      // `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateEnum({ type: 'string', options: ['red'] }, 'red'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if options is empty', () => {
      // Validate an enum for which the validator's `options`
      // parameter is empty. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateEnum({ type: 'enum', options: [] }, 'red'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if options contains an invalid type', () => {
      // Validate an enum for which the validator's `options` parameter
      // contains an object. Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateEnum({ type: 'enum', options: ['red', {}] }, 'red'),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
