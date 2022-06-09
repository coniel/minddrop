import { InvalidValidatorError, ValidationError } from '../../errors';
import { RecordValidator } from '../../types';
import { validateRecord } from './validateRecord';

const validator: RecordValidator = {
  type: 'record',
  values: { type: 'string' },
};

describe('validateRecord', () => {
  describe('invalid', () => {
    it('throws if the value is not an object', () => {
      // Validate a value that is not an object. Should throw a
      // `ValidationError`.
      expect(() => validateRecord(validator, 123)).toThrowError(
        ValidationError,
      );
    });

    it('throws if the value is `null`', () => {
      // Validate a `null` value. Should throw a `ValidationError`.
      expect(() => validateRecord(validator, null)).toThrowError(
        ValidationError,
      );
    });

    it('throws if the object is empty with `allowEmpty` set to false', () => {
      // Validate an empty object with `allowEmpty` set to false. Should
      // throw a `ValidationError`.
      expect(() =>
        validateRecord({ ...validator, allowEmpty: false }, {}),
      ).toThrowError(ValidationError);
    });

    it('throws if a value does not pass `values` validator', () => {
      // Validate a record containing an invalid value. Should throw a
      // `ValidationError`.
      expect(() =>
        validateRecord(validator, { foo: 'foo', bar: 123 }),
      ).toThrowError(ValidationError);
    });

    it('throws if a value does not pass custom `values` validator', () => {
      // Validate a record containing an invalid value using a custom validator
      // as the `values` validator. Should throw a `ValidationError`.
      expect(() =>
        validateRecord(
          { ...validator, values: { type: 'custom' } },
          { foo: 'foo', bar: 123 },
          {
            custom: () => {
              throw new ValidationError('error');
            },
          },
        ),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes if the record is valid', () => {
      // Validate a valid record. Should not throw an error.
      expect(() =>
        validateRecord(validator, { foo: 'foo', bar: 'bar' }),
      ).not.toThrow();
    });

    it('passes if the record is empty and `allowEmpty` is not false', () => {
      // Validate an empty record. Should not throw an error.
      expect(() => validateRecord(validator, {})).not.toThrow();
    });

    it('supports custom value validators', () => {
      // Validate a valid record using a custom validator as the `values`
      // validator. Should not throw an error.
      expect(() =>
        validateRecord(
          { ...validator, values: { type: 'custom' } },
          { foo: 'foo', bar: 123 },
          {
            custom: () => null,
          },
        ),
      ).not.toThrow();
    });

    it('supports a multi-type `values` validator', () => {
      // Validate a valid record allowing multiple value types.
      // Should not throw an error.
      expect(() =>
        validateRecord(
          {
            type: 'record',
            values: { type: [{ type: 'string' }, { type: 'number' }] },
          },
          { foo: 'foo', bar: 123 },
        ),
      );
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a record validator', () => {
      // Call with a non-record validator. Should throw an
      // `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateRecord({ type: 'string' }, {})).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the validator does not define a `values` validator', () => {
      // Call with a validator which does not have a `values` value.
      // Should throw a `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateRecord({ type: 'record' }, {})).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if `values` is not a valid validator', () => {
      // Call with a validator which does not have a valid `values`
      // validator. Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateRecord({ type: 'record', values: {} }, {}),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowEmpty` is not a boolean', () => {
      // Call with a validator which contains a non-boolean `allowEmpty` value.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateRecord(
          {
            type: 'record',
            values: { type: 'string' },
            // @ts-ignore
            allowEmpty: 'why not',
          },
          {},
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
