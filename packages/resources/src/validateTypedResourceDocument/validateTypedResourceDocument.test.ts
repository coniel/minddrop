import { ResourceValidationError } from '../errors';
import { RDDataSchema, TypedResourceDocument } from '../types';
import { generateResourceDocument } from '../generateResourceDocument';
import { validateTypedResourceDocument } from './validateTypedResourceDocument';

interface BaseData {
  baseField: string;
}

interface TypeData {
  typeField: string;
}

const baseSchema: RDDataSchema<BaseData> = {
  baseField: {
    type: 'string',
    required: true,
  },
};

const typeSchema: RDDataSchema<TypeData> = {
  typeField: {
    type: 'string',
    required: true,
  },
};

const document: TypedResourceDocument<BaseData, TypeData> =
  generateResourceDocument('tests:test', {
    baseField: 'foo',
    typeField: 'foo',
    type: 'test-type',
  });

describe('validateTypedResourceDocument', () => {
  describe('`type` field', () => {
    it('throws if `type` is missing', () => {
      const documentWihtoutType = document;
      delete document.type;

      // Validate a typed resource document with no type.
      // Should throw a `ResourceValidationError`.
      expect(() =>
        validateTypedResourceDocument(
          'test',
          baseSchema,
          typeSchema,
          documentWihtoutType,
        ),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `type` is not a string', () => {
      // Validate a typed resource document with an invalid type.
      // Should throw a `ResourceValidationError`.
      expect(() =>
        validateTypedResourceDocument('test', baseSchema, typeSchema, {
          ...document,
          // @ts-ignore
          type: 1,
        }),
      ).toThrowError(ResourceValidationError);
    });

    it('throws if `type` is an empty string', () => {
      // Validate a typed resource document with an empty type string.
      // Should throw a `ResourceValidationError`.
      expect(() =>
        validateTypedResourceDocument('test', baseSchema, typeSchema, {
          ...document,
          type: '',
        }),
      ).toThrowError(ResourceValidationError);
    });
  });

  it('validates the base custom data', () => {
    // Validate a typed resource document containing invalid base
    // custom data. Should throw a `ResourceValidationError`.
    expect(() =>
      validateTypedResourceDocument('test', baseSchema, typeSchema, {
        ...document,
        baseField: 1,
      }),
    ).toThrowError(ResourceValidationError);
  });

  it('validates the type specific custom data', () => {
    // Validate a typed resource document containing invalid type
    // specific custom data. Should throw a `ResourceValidationError`.
    expect(() =>
      validateTypedResourceDocument('test', baseSchema, typeSchema, {
        ...document,
        typeField: 1,
      }),
    ).toThrowError(ResourceValidationError);
  });
});
