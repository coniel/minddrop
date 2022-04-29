import { InvalidValidatorError } from '../../errors';
import { validateSchema } from './validateSchema';
import { ValidatorOptionsSchema } from '../../types';

describe('validateSchema', () => {
  describe('invalid', () => {
    it('throws if the value is not an object', () => {
      // Call with a value which is not an object.
      // Should throw a `InvalidValidatorError`.
      expect(() => validateSchema({ type: 'schema' }, 1234)).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the value is null', () => {
      // Call with a value which is `null`.
      // Should throw a `InvalidValidatorError`.
      expect(() => validateSchema({ type: 'schema' }, null)).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the schema is empty', () => {
      // Call with an empty object as the value.
      // Should throw an `InvalidValidatorError`.
      expect(() => validateSchema({ type: 'schema' }, {})).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if the schema contains an invalid validator', () => {
      // Validate a schema containing an invalid validator.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema({ type: 'schema' }, { foo: {} }),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a core validator contains invalid options', () => {
      // Validate a schema containing a core validator with invalid options.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          {
            type: 'schema',
          },

          { foo: { type: 'string', allowEmpty: 1 } },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if a custom validator contains invalid options', () => {
      // Validate a schema containing a custom validator with invalid options.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          {
            type: 'schema',
            allowedTypes: ['custom'],
            validatorOptionsSchemas: {
              custom: {
                booleanOption: { type: 'boolean' },
              } as ValidatorOptionsSchema,
            },
          },
          { foo: { type: 'custom', booleanOption: 1 } },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    describe('field validator options', () => {
      it('throws if `required` is invalid', () => {
        // Validate a schema containing a field with an invalid `required` value.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                required: 1,
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if `required-with` is invalid', () => {
        // Validate a schema containing a field with an invalid `required-with` value.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                requiredWith: [],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if `required-without` is invalid', () => {
        // Validate a schema containing a field with an invalid `required-without` value.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                requiredWithout: [],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if `forbidenWith` is invalid', () => {
        // Validate a schema containing a field with an invalid `forbidenWith` value.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                forbidenWith: [],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if `forbidenWithout` is invalid', () => {
        // Validate a schema containing a field with an invalid `forbidenWithout` value.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                forbidenWithout: [],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if a `required-with` key does not exist', () => {
        // Validate a schema containing a field for which a `required-with` field
        // does not exist. Should throw an `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                requiredWith: ['bar'],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if a `required-without` key does not exist', () => {
        // Validate a schema containing a field for which a `required-without` field
        // does not exist. Should throw an `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                requiredWithout: ['bar'],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if a `forbiden-with` key does not exist', () => {
        // Validate a schema containing a field for which a `forbiden-with` field
        // does not exist. Should throw an `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                forbidenWith: ['bar'],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });

      it('throws if a `forbiden-without` key does not exist', () => {
        // Validate a schema containing a field for which a `forbiden-without` field
        // does not exist. Should throw an `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            { type: 'schema' },
            {
              foo: {
                type: 'string',
                forbidenWithout: ['bar'],
              },
            },
          ),
        ).toThrowError(InvalidValidatorError);
      });
    });

    describe('custom field options', () => {
      it('throws if a custom field option value is invalid', () => {
        // Validate a schema containing an invalid value for custom field option.
        // Should throw a `InvalidValidatorError`.
        expect(() =>
          validateSchema(
            {
              type: 'schema',
              customFieldOptions: { static: { type: 'boolean' } },
            },
            { foo: { type: 'string', static: 'yes' } },
          ),
        ).toThrowError(InvalidValidatorError);
      });
    });
  });

  describe('valid', () => {
    it('passes if validator options are valid', () => {
      // Validate a valid schema containing a validator with options.
      // Should not throw an error.
      expect(() =>
        validateSchema(
          {
            type: 'schema',
            allowedTypes: ['string', 'custom'],
            validatorOptionsSchemas: {
              custom: {
                booleanOption: { type: 'boolean' },
              } as ValidatorOptionsSchema,
            },
          },
          {
            foo: { type: 'string', required: true, allowEmpty: true },
            bar: { type: 'custom', forbidenWith: ['foo'], booleanOption: true },
          },
        ),
      ).not.toThrowError();
    });
  });

  describe('validator validation', () => {
    it('throws if the validator is not a schema validator', () => {
      // Call with a non schema validator. Should throw a
      // `InvalidValidatorError`.
      // @ts-ignore
      expect(() => validateSchema({ type: 'string' }, {})).toThrowError(
        InvalidValidatorError,
      );
    });

    it('throws if `validatorOptionSchemas` contains an invalid schema', () => {
      // Call with a `validatorOptionSchemas` containing an invalid schema.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          { type: 'schema', validatorOptionsSchemas: { foo: {} } },
          { bar: { type: 'string' } },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowedTypes` is not an array', () => {
      // Call with an invalid `allowedTypes` option value.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          // @ts-ignore
          { type: 'schema', allowedTypes: 'string' },
          { foo: { type: 'string' } },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowedTypes` contains a non-string value', () => {
      // Call with an invalid `allowedTypes` option value.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          // @ts-ignore
          { type: 'schema', allowedTypes: [1234] },
          { foo: { type: 'string' } },
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `customFieldOptions` contains an invalid validator', () => {
      // Call with `customFieldOptions` containing an invalid validator.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        validateSchema(
          // @ts-ignore
          { type: 'schema', customFieldOptions: { static: 'boolean' } },
          { foo: { type: 'string' } },
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
