import { InvalidValidatorError } from '../../errors';
import {
  Schema,
  CoreFieldValidator,
  FieldValidator,
  SchemaValidator,
} from '../../types';
import { contains } from '../../contains';
import { getMissingItems } from '../../getMissingItems';
import {
  ObjectValidatorOptionsSchema,
  ArrayValidatorOptionsSchema,
  NumberValidatorOptionsSchema,
  EnumValidatorOptionSchema,
  RecordValidatorOptionsSchema,
  SchemaValidatorOptionsSchema,
  SetValidatorOptionsSchema,
  StringValidatorOptionsSchema,
} from '../validator-options-schemas';
import { validateValidator } from '../validateValidator';

export const FieldValidatorOptionsSchema: Schema = {
  required: {
    type: 'boolean',
    required: false,
  },
  requiredWith: {
    type: 'array',
    required: false,
    allowEmpty: false,
    items: {
      type: 'string',
      allowEmpty: false,
    },
  },
  requiredWithout: {
    type: 'array',
    required: false,
    allowEmpty: false,
    items: {
      type: 'string',
      allowEmpty: false,
    },
  },
  forbidenWith: {
    type: 'array',
    required: false,
    allowEmpty: false,
    items: {
      type: 'string',
      allowEmpty: false,
    },
  },
  forbidenWithout: {
    type: 'array',
    required: false,
    allowEmpty: false,
    items: {
      type: 'string',
      allowEmpty: false,
    },
  },
};

const coreValidatorOptionsSchemas = {
  array: ArrayValidatorOptionsSchema,
  enum: EnumValidatorOptionSchema,
  number: NumberValidatorOptionsSchema,
  object: ObjectValidatorOptionsSchema,
  record: RecordValidatorOptionsSchema,
  schema: SchemaValidatorOptionsSchema,
  set: SetValidatorOptionsSchema,
  string: StringValidatorOptionsSchema,
};

/**
 * Validates a schema by ensuring that each of it's validators are valid.
 *
 * Automatically validates core validtor options without the need to
 * provide their options schemas.
 *
 * @param valiator - The schema validator.
 * @param value - The schema to validate.
 *
 * @throws InvalidValidatorError
 * Throws if any of the schema's validators are invalid.
 */
export function validateSchema<
  TValidator extends FieldValidator = CoreFieldValidator,
>(validator: SchemaValidator<TValidator>, value: unknown): void {
  // Ensure that the validator is valid
  validateValidator(
    {
      type: 'validator',
      allowedTypes: ['schema'],
      optionsSchemas: coreValidatorOptionsSchemas,
    },
    validator,
  );

  // Ensure that the schema is a non-null object
  if (typeof value !== 'object' || value === null) {
    throw new InvalidValidatorError(
      `must be a schema object, received '${
        value === null ? `null` : typeof value
      }'`,
    );
  }

  // Ensure that the schema is not empty
  if (Object.keys(value).length === 0) {
    throw new InvalidValidatorError('schema cannot be empty');
  }

  // Add core validator options schemas to the provided ones
  const optionsSchemas = {
    ...coreValidatorOptionsSchemas,
    ...(validator.validatorOptionsSchemas || {}),
  };

  // For each allowed field type, add the core field validator options
  // and any custom field validator options to its options schema.
  (validator.allowedTypes || Object.keys(coreValidatorOptionsSchemas)).forEach(
    (key) => {
      optionsSchemas[key] = {
        ...(optionsSchemas[key] || {}),
        ...FieldValidatorOptionsSchema,
        ...(validator.customFieldOptions || {}),
      };
    },
  );

  // Loop through the schema's fields
  Object.keys(value).forEach((fieldName) => {
    const fieldValidator = value[fieldName];

    try {
      // Validate the field validator
      validateValidator(
        {
          type: 'validator',
          allowedTypes: validator.allowedTypes,
          optionsSchemas,
          allowMultiType: true,
          ignoreExtraneousOptions: false,
        },
        fieldValidator,
      );
    } catch (error) {
      // Re-throw the error adding additional context
      throw new InvalidValidatorError(`[${fieldName}] ${error.message}`);
    }

    // Ensure that all fields referenced by requiredWith(out)/
    // forbidenWith(out) options exist.
    [
      'requiredWith',
      'requiredWithout',
      'forbidenWith',
      'forbidenWithout',
    ].forEach((option) => {
      // Get a list of the schema's fields
      const schemaFields = Object.keys(value);

      if (
        // Field validator uses the option
        fieldValidator[option] &&
        // One or more of the option fields does not exist in the schema
        !contains(schemaFields, fieldValidator[option])
      ) {
        // Get the missing keys
        const missing = getMissingItems(schemaFields, fieldValidator[option]);

        // Throw a `InvalidValidatorError` providing details
        throw new InvalidValidatorError(
          `[${fieldName}] \`${option}\` field${
            missing.length > 1 ? 's' : ''
          } '${missing.join("', '")}' ${
            missing.length > 1 ? 'do' : 'does'
          } not exist in schema`,
        );
      }
    });
  });
}
