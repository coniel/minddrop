import { InvalidValidatorError, ValidationError } from '@minddrop/utils';
import { validateResourceReferences } from './validateResourceReferences';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceReferencesValidator,
} from '../../types';
import { createResource } from '../../createResource';
import { cleanup, core, setup } from '../../test-utils';
import { ResourceApisStore } from '../../ResourceApisStore';

const validator: ResourceReferencesValidator = {
  type: 'resource-references',
};

const config: ResourceConfig<{ foo: string }> = {
  resource: 'tests:test',
  dataSchema: {
    foo: {
      type: 'string',
      required: false,
    },
  },
};

const ResourceApi = { ...createResource(config), extension: core.extensionId };

describe('validateResourceReference', () => {
  let document: ResourceDocument<{}>;

  beforeEach(() => {
    setup();

    // Register the test resource
    ResourceApisStore.register(ResourceApi);
    // Create a test document
    document = ResourceApi.create(core, {});
  });

  afterEach(cleanup);

  describe('invalid value', () => {
    it('throws if the value is not an array', () => {
      // Validate a value which is not an array.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReferences(
          { type: 'resource-references' },
          { id: 'document-id', resource: 'resource' },
        ),
      ).toThrowError(ValidationError);
    });

    it('throws if the array contains an invalid `resource-reference` validator', () => {
      // Validate a value containing an invalid `resource-reference`.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReferences(validator, [
          { resource: 'tests:test', id: '' },
        ]),
      ).toThrowError(ValidationError);
    });

    it('throws given an empty array if `allowEmpty` is `false`', () => {
      // Validate an empty array with the `allowEmpty` option set to `false`.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReferences(
          { type: 'resource-references', allowEmpty: false },
          [],
        ),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes given a valid resource reference', () => {
      // Validate a valid array of resource references.
      // Should not throw an error.
      expect(() =>
        validateResourceReferences(validator, [
          {
            resource: 'tests:test',
            id: document.id,
          },
        ]),
      ).not.toThrow();
    });

    it('passes given an empty array if `allowEmpty` is not false', () => {
      // Validate an empty array with the `allowEmpty` option set to `true`.
      // Should not throw an error.
      expect(() =>
        validateResourceReferences(
          { type: 'resource-references', allowEmpty: true },
          [],
        ),
      ).not.toThrow();
    });
  });

  describe('invalid validator', () => {
    it('throws if the validator is no a `resource-references` validator', () => {
      // Call with a non `resource-references` validator. Should throw
      // an `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateResourceReferences({ type: 'string' }, 'foo'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `allowEmpty` is not a boolean', () => {
      // Call with a validator with an invalid `allowEmpty` value.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        validateResourceReferences(
          // @ts-ignore
          { type: 'resource-references', allowEmpty: 1 },
          [],
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });
});
