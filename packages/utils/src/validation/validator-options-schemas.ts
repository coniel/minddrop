import {
  ValidatorOptionsSchema,
  ObjectValidator,
  ArrayValidator,
  EnumValidator,
  NumberValidator,
  RecordValidator,
  SchemaValidator,
  SetValidator,
  StringValidator,
} from '../types';

export const ObjectValidatorOptionsSchema: ValidatorOptionsSchema<ObjectValidator> =
  {
    schema: {
      type: 'schema',
      required: true,
    },
  };

export const ArrayValidatorOptionsSchema: ValidatorOptionsSchema<ArrayValidator> =
  {
    items: {
      type: 'validator',
      requiredWithout: ['itemValidatorFn'],
    },
    itemValidatorFn: {
      type: 'function',
    },
    allowEmpty: {
      type: 'boolean',
      required: false,
    },
  };

export const EnumValidatorOptionSchema: ValidatorOptionsSchema<EnumValidator> =
  {
    options: {
      type: 'array',
      allowEmpty: false,
      required: true,
      items: {
        type: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'null' },
        ],
      },
    },
  };

export const NumberValidatorOptionsSchema: ValidatorOptionsSchema<NumberValidator> =
  {
    min: {
      type: 'number',
    },
    max: {
      type: 'number',
    },
  };

export const RecordValidatorOptionsSchema: ValidatorOptionsSchema<RecordValidator> =
  {
    values: {
      type: 'validator',
      required: true,
    },
    allowEmpty: {
      type: 'boolean',
    },
  };

export const SchemaValidatorOptionsSchema: ValidatorOptionsSchema<SchemaValidator> =
  {
    allowedTypes: {
      type: 'array',
      required: false,
      items: {
        type: 'string',
      },
    },
    validatorOptionsSchemas: {
      type: 'record',
      required: false,
      values: {
        type: 'schema',
      },
    },
    customFieldOptions: {
      type: 'record',
      required: false,
      values: {
        type: 'validator',
      },
    },
  };

export const SetValidatorOptionsSchema: ValidatorOptionsSchema<SetValidator> = {
  options: {
    type: 'array',
    required: true,
    allowEmpty: false,
    items: {
      type: [
        { type: 'string' },
        { type: 'number' },
        { type: 'boolean' },
        { type: 'null' },
      ],
    },
  },
  allowEmpty: {
    type: 'boolean',
  },
};

export const StringValidatorOptionsSchema: ValidatorOptionsSchema<StringValidator> =
  {
    allowEmpty: {
      type: 'boolean',
    },
  };
