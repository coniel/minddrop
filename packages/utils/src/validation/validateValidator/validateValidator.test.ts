import { InvalidValidatorError } from '../../errors';
import {
  BaseValidator,
  Validator,
  ValidatorOptionsSchema,
  ValidatorValidator,
} from '../../types';
import { validateValidator } from './validateValidator';

interface StringValidator extends BaseValidator<string> {
  allowEmpty?: boolean;
}

const optionsSchema: ValidatorOptionsSchema<StringValidator> = {
  allowEmpty: {
    type: 'boolean',
  },
};

const validator: ValidatorValidator = {
  type: 'validator',
  allowedTypes: ['string'],
  optionsSchemas: {
    string: optionsSchema,
  },
};

const value: Validator = {
  type: 'string',
};

describe('validateValidator', () => {
  describe('invalid', () => {
    it('throws if the validator is not an object', () => {
      // Validate a value which is not an object.
      // Should throw an `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateValidator(validator, 'string')).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the validator is `null`', () => {
      // Validate a value which is `null`.
      // Should throw an `InvalidValidatorError`.
      expect(() => validateValidator(null, 'string')).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the validator does not have a `type`', () => {
      // Validate a validator without a `type` property.
      // Should throw an `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateValidator(validator, {})).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the validator type is not allowed', () => {
      // Validate a validator with a type that is not listed in
      // `allowedTypes`. Should throw an `InvalidValidatorError`.
      expect(() =>
        validateValidator(validator, { type: 'number' }),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a validator option does not conform to the `optionsSchema`', () => {
      // Validate a validator with an invalid option.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateValidator(validator, { type: 'string', allowEmpty: 1 }),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a validator contains extra options when `ignoreExtraneousOptions` if false', () => {
      // Validate a validator containing an option which is not listed
      // in the otpions schema and with the `ignoreExtraneousOptions`
      // argument set to `false`.  Should throw a `InvalidValidatorError`.
      expect(() =>
        validateValidator(
          { ...validator, ignoreExtraneousOptions: false },
          { ...value, required: true },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if the validator is a multi-type validator without `allowMutliType` being true', () => {
      // Validate a multi-type validator with allowMultiType set to `false`.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateValidator(
          { type: 'validator', allowMultiType: false },
          { type: [{ type: 'string' }, { type: 'number' }] },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if the validator is a multi-type validator containing an invalid validator', () => {
      // Validate a multi-type validator containing an invalid validator.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateValidator(
          { type: 'validator', allowMultiType: true, allowedTypes: ['string'] },
          { type: [{ type: 'string' }, { type: 'number' }] },
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });

  describe('valid', () => {
    it('passes if a validator without options is valid', () => {
      // Validate a valid optionless validator.
      // Should not throw an error.
      expect(() =>
        validateValidator(validator, { type: 'string' }),
      ).not.toThrow();
    });

    it('passes if a validator with options is valid', () => {
      // Validate a valid validator containing options.
      // Should not throw an error.
      expect(() =>
        validateValidator(validator, { type: 'string', allowEmpty: true }),
      ).not.toThrow();
    });

    it('passes if a validator with nested validators is valid', () => {
      // Validate a valid validator containing nested validators.
      // Should not throw an error.
      expect(() =>
        validateValidator(
          {
            ...validator,
            allowedTypes: ['record'],
          },
          { type: 'record', values: { type: 'schema' } },
        ),
      ).not.toThrow();
    });

    it('passes with a valid multi-type validator', () => {
      // Validate a valid multi-type validator.
      // Should not throw an error.
      expect(() =>
        validateValidator(
          {
            type: 'validator',
            allowMultiType: true,
            allowedTypes: ['string', 'number'],
          },
          { type: [{ type: 'string' }, { type: 'number' }] },
        ),
      ).not.toThrow();
    });

    it('ignores extra options when `ignoreExtraneousOptions` is true', () => {
      // Validate a valid validator containing a extra property not
      // listed in the options's schema. Should not throw an error.
      expect(() =>
        validateValidator(
          { ...validator, ignoreExtraneousOptions: true },
          { type: 'string', required: true },
        ),
      ).not.toThrow();
    });
  });
});
