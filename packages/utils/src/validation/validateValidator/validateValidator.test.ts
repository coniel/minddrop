import { InvalidValidatorError } from '../../errors';
import { validateValidator } from './validateValidator';

describe('validateValidator', () => {
  describe('invalid', () => {
    it('throws if the validator does not have a `type`', () => {
      // Validate a validator without a `type` property.
      // Should throw an `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateValidator({}, 'string')).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if a validator option does not conform to the `optionsSchema`', () => {
      // Validate a validator with an invalid option.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateValidator({ type: 'string', allowEmpty: 1 }, 'string', {
          allowEmpty: { type: 'boolean' },
        }),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a validator contains extra options when `ignoreExtraneousOptions` if false', () => {
      // Validate a validator containing an option which is not listed
      // in the otpions schema and with the `ignoreExtraneousOptions`
      // argument set to `false`.  Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateValidator(
          { type: 'string', required: true },
          'string',
          {},
          false,
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a validator option does not conform the `extendedOptionsSchema`', () => {
      // Validate a validator with an invalid extended option.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateValidator(
          { type: 'string', required: 1 },
          'string',
          {},
          false,
          {
            required: { type: 'boolean' },
          },
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });

  describe('valid', () => {
    it('passes if a validator without options is valid', () => {
      // Validate a valid optionless validator.
      // Should not throw an error.
      expect(() =>
        validateValidator({ type: 'string' }, 'string'),
      ).not.toThrow();
    });

    it('passes if a validator with options is valid', () => {
      // Validate a valid validator containing options.
      // Should not throw an error.
      expect(() =>
        validateValidator({ type: 'string', allowEmpty: true }, 'string', {
          allowEmpty: { type: 'boolean' },
        }),
      ).not.toThrow();
    });

    it('passes if a validator with extended options is valid', () => {
      // Validate a valid validator containing extended options.
      // Should not throw an error.
      expect(() =>
        validateValidator(
          { type: 'string', allowEmpty: true, required: true },
          'string',
          {
            allowEmpty: { type: 'boolean' },
          },
          false,
          { required: { type: 'boolean' } },
        ),
      ).not.toThrow();
    });

    it('ignores extra options when `ignoreExtraneousOptions` is true', () => {
      // Validate a valid validator containing a extra property not
      // listed in the options's schema. Should not throw an error.
      expect(() =>
        validateValidator(
          { type: 'string', allowEmpty: true, required: true },
          'string',
          {
            allowEmpty: { type: 'boolean' },
          },
          true,
        ),
      ).not.toThrow();
    });
  });
});
