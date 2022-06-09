import { InvalidValidatorError, ValidationError } from '../../errors';
import { validateSet } from './validateSet';

describe('validateSet', () => {
  describe('invalid', () => {
    it('throws if a value is not lised in the options', () => {
      // Validate a set containing a value which is not listed in the
      // validator's options. Should throw a `ValidationError`.
      expect(() =>
        validateSet({ type: 'set', options: ['red', 'blue'] }, [
          'red',
          'purple',
        ]),
      ).toThrowError(ValidationError);
    });

    it('throws if the value is undefined', () => {
      // Validate a set containing `undefined`. Should throws a
      // `ValidationError`.
      expect(() =>
        validateSet({ type: 'set', options: ['red', 'blue'] }, [undefined]),
      ).toThrowError(ValidationError);
    });

    it('throws if the set is empty and `allowEmpty` is false', () => {
      // Validate an empty set with a validator which does not allow
      // empty sets. Should throw a `ValidationError`.
      expect(() =>
        validateSet(
          { type: 'set', options: ['red', 'blue'], allowEmpty: false },
          [],
        ),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if the set contains only values listed in the options', () => {
      // Validate a set for which the values are listed in
      // the validator's options. Should not throw an error.
      expect(() =>
        validateSet({ type: 'set', options: ['red', 'blue'] }, ['red', 'blue']),
      ).not.toThrow();
    });

    it('passes if the set is empty and `allowEmpty` is true', () => {
      // Validate an empty set with a validator which allows empty sets.
      // Should not throw an error.
      expect(() =>
        validateSet(
          { type: 'set', options: ['red', 'blue'], allowEmpty: true },
          [],
        ),
      ).not.toThrow();
    });

    it('allows empty sets by default', () => {
      // Validate an empty set with a validator which does not set
      // `allowEmpty` to any value. Should not throw an error.
      expect(() =>
        validateSet({ type: 'set', options: ['red', 'blue'] }, []),
      ).not.toThrow();
    });

    it('supports `null` as an option', () => {
      // Validate a set for which the validator's options contains
      // `null`. Should not throw a `InvalidValidatorError` error.
      expect(() =>
        // @ts-ignore
        validateSet({ type: 'set', options: ['red', null] }, [null]),
      ).not.toThrowError(InvalidValidatorError);
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a set validator', () => {
      // Call with a non-set validator. Should throw a
      // `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateSet({ type: 'string', options: ['red'] }, ['red']),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if options is empty', () => {
      // Validate a set for which the validator's `options`
      // parameter is empty. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSet({ type: 'set', options: [] }, 'red'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if options contains an invalid type', () => {
      // Validate a set for which the validator's options contains
      // an object. Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateSet({ type: 'set', options: ['red', {}] }, 'red'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowEmpty` is not a boolean', () => {
      // Validate a set using a validator with an invalid `allowEmpty`
      // option. Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSet(
          {
            type: 'set',
            options: ['red'],
            // @ts-ignore
            allowEmpty: 'sure',
          },
          [],
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
