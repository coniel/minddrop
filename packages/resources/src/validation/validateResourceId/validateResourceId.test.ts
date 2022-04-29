import { InvalidValidatorError, ValidationError } from '@minddrop/utils';
import { ResourceApisStore } from '../../ResourceApisStore';
import { setup, cleanup, core } from '../../test-utils';
import { ResourceConfig, ResourceIdValidator } from '../../types';
import { createResource } from '../../createResource';
import { validateResourceId } from './validateResourceId';

const validator: ResourceIdValidator = {
  type: 'resource-id',
  resource: 'tests:test',
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

const ResourceApi = createResource(config);

describe('validateResourceId', () => {
  beforeEach(() => {
    setup();

    // Register the test resource
    ResourceApisStore.register(ResourceApi);
  });

  afterEach(cleanup);

  describe('invalid validator', () => {
    it('throws if the validator is not a `resource-id` validator', () => {
      // Call with a non `resource-id` validator.
      // Should throw a `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateResourceId({ type: 'string' }, ['test']),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if the validator does not contain `resource`', () => {
      // Call with a validator missing the `resource` property.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        // @ts-ignore
        validateResourceId({ type: 'resource-id' }, 'document-id'),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `resource` is not a string', () => {
      // Call with a validator with an invalid `resource` property.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        validateResourceId(
          // @ts-ignore
          { type: 'resource-id', resource: 1234 },
          'document-id',
        ),
      ).toThrowError(InvalidValidatorError);
    });

    it('throws if `resource` is an empty string', () => {
      // Call with a validator with an empty `resource` property.
      // Should throw an `InvalidValidatorError`.
      expect(() =>
        validateResourceId(
          { type: 'resource-id', resource: '' },
          'document-id',
        ),
      ).toThrowError(InvalidValidatorError);
    });
  });

  describe('invalid', () => {
    it('throws if the ID is not a string', () => {
      // Validate a non-string value. Should throw a `ValidationError`.
      expect(() => validateResourceId(validator, 1234)).toThrowError(
        ValidationError,
      );
    });

    it('throws if the resource is not registered', () => {
      // Validate a resource ID of an unregistered resource. Should
      // throw a validation error.
      expect(() =>
        validateResourceId(
          { ...validator, resource: 'unregistered' },
          'document-id',
        ),
      ).toThrowError(ValidationError);
    });

    it('throws if the resource document does not exist', () => {
      // Validate a resource ID of a resource document which does not
      // exist. Should throw a `ValidationError`.
      expect(() => validateResourceId(validator, 'missing')).toThrowError(
        ValidationError,
      );
    });
  });

  describe('valid', () => {
    it('passes if the resource is registered and the document exists', () => {
      // Create a test document
      const document = ResourceApi.create(core, {});

      // Validate the document ID
      expect(() => validateResourceId(validator, document.id)).not.toThrow();
    });
  });
});
