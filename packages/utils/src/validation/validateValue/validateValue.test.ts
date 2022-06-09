import { InvalidValidatorError, ValidationError } from '../../errors';
import { validateValue } from './validateValue';

interface CustomValidator {
  type: 'custom';
}

describe('validateValue', () => {
  describe('invalid schema', () => {
    it('throws if the validator type is invalid', () => {
      // Validate a resource using a schema that contains an invalid
      // field type. Should throw a `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateValue({ type: 'invalid' }, 1)).toThrowError(
        InvalidValidatorError,
      );
    });
  });

  it('validates `string` field', () => {
    // Validate an invalid string value. Should throw a `ValidationError`.
    expect(() => validateValue({ type: 'string' }, 2)).toThrowError(
      ValidationError,
    );
  });

  it('validates `number` field', () => {
    // Validate an invalid number value. Should throw a `ValidationError`.
    expect(() => validateValue({ type: 'number' }, 'hello')).toThrowError(
      ValidationError,
    );
  });

  it('validates `boolean` field', () => {
    // Validate an invalid boolean value. Should throw a `ValidationError`.
    expect(() => validateValue({ type: 'boolean' }, 1)).toThrowError(
      ValidationError,
    );
  });

  it('validates `date` field', () => {
    // Validate an invalid date value. Should throw a `ValidationError`.
    expect(() => validateValue({ type: 'date' }, 1234)).toThrowError(
      ValidationError,
    );
  });

  it('validates `enum` field', () => {
    // Validate an invalid enum value. Should throw a `ValidationError`.
    expect(() =>
      validateValue({ type: 'enum', options: ['red', 'blue'] }, 'purple'),
    ).toThrowError(ValidationError);
  });

  it('validates `set` field', () => {
    // Validate an invalid set value. Should throw a `ValidationError`.
    expect(() =>
      validateValue({ type: 'set', options: ['red', 'blue'] }, ['purple']),
    ).toThrowError(ValidationError);
  });

  it('validates `function` value', () => {
    // Validate an invalid function value. Should throw a `ValidationError`.
    expect(() =>
      validateValue({ type: 'function' }, 'doSomething()'),
    ).toThrowError(ValidationError);
  });

  it('validates `record` field', () => {
    // Validate an invalid record value. Should throw a `ValidationError`.
    expect(() =>
      validateValue(
        { type: 'record', values: { type: 'string' } },
        { foo: 123 },
      ),
    ).toThrowError(ValidationError);
  });

  it('validates `record` field with custom validators', () => {
    // Validate an invalid record value with a custom validator. Should
    // throw a `ValidationError`.
    expect(() =>
      validateValue(
        { type: 'record', values: { type: 'custom' } },
        { foo: 123 },
        {
          custom: () => {
            throw new ValidationError('error');
          },
        },
      ),
    ).toThrowError(ValidationError);
  });

  it('validates `array` field', () => {
    // Validate an invalid array value. Should throw a `ValidationError`.
    expect(() =>
      validateValue({ type: 'array', items: { type: 'string' } }, [1234]),
    ).toThrowError(ValidationError);
  });

  it('validates `array` field with custom validators', () => {
    // Validate an invalid array value with a custom validator. Should
    // throw a `ValidationError`.
    expect(() =>
      validateValue({ type: 'array', items: { type: 'custom' } }, [1234], {
        custom: () => {
          throw new ValidationError('error');
        },
      }),
    ).toThrowError(ValidationError);
  });

  it('validates `object` field', () => {
    // Validate an invalid object value. Should throw a `ValidationError`.
    expect(() =>
      validateValue(
        { type: 'object', schema: { title: { type: 'string' } } },
        { title: 1234 },
      ),
    ).toThrowError(ValidationError);
  });

  it('validates `object` field with custom validators', () => {
    // Validate an invalid object value with a custom validator. Should
    // throw a `ValidationError`.
    expect(() =>
      validateValue(
        { type: 'object', schema: { title: { type: 'custom' } } },
        { title: 1234 },
        {
          custom: () => {
            throw new ValidationError('error');
          },
        },
      ),
    ).toThrowError(ValidationError);
  });

  it('validates `validator` field', () => {
    // Validate an invalid validator value. Should throw a `InvalidValidatorError`.
    expect(() =>
      validateValue(
        { type: 'validator', allowedTypes: ['string'] },
        { type: 'number' },
      ),
    ).toThrowError(InvalidValidatorError);
  });

  it('validates custom fields with custom validator', () => {
    // The custom validator
    const customValidator: CustomValidator = { type: 'custom' };
    // The custom validator functions
    const customValidatorFns = { custom: jest.fn() };

    // Validate using a custom validator
    validateValue<CustomValidator>(customValidator, 'foo', customValidatorFns);

    // Should call the custom validator function
    expect(customValidatorFns.custom).toHaveBeenCalledWith(
      customValidator,
      'foo',
      customValidatorFns,
    );
  });

  describe('multiple validators', () => {
    it('throws if all of the validators fail', () => {
      // Validate a valid value which can be one of two values.
      // Should not throw an error.
      expect(() =>
        validateValue({ type: [{ type: 'string' }, { type: 'number' }] }, true),
      ).toThrowError(ValidationError);
    });

    it('passes if one of the validators passes', () => {
      // Validate a valid value which can be one of two values.
      // Should not throw an error.
      expect(() =>
        validateValue({ type: [{ type: 'string' }, { type: 'number' }] }, 1234),
      ).not.toThrow();
    });
  });
});
