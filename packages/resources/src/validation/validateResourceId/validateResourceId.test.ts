import { ValidationError } from '@minddrop/utils';
import { ResourceApisStore } from '../../ResourceApisStore';
import { setup, cleanup, core } from '../../test-utils';
import { ResourceConfig, ResourceIdValidator } from '../../types';
import { createResource } from '../../createResource';
import { validateResourceId } from './validateResourceId';

const validator: ResourceIdValidator = {
  type: 'resource-id',
  resource: 'tests:test',
};

const config: ResourceConfig<{}> = {
  resource: 'tests:test',
  dataSchema: {},
};

const ResourceApi = createResource(config);

describe('validateResourceId', () => {
  beforeEach(() => {
    setup();

    // Register the test resource
    ResourceApisStore.register(ResourceApi);
  });

  afterEach(cleanup);

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
