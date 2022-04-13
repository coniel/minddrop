import { ValidationError } from '@minddrop/utils';
import { ResourceApisStore } from '../../ResourceApisStore';
import { setup, cleanup, core } from '../../test-utils';
import { ResourceConfig, ResourceIdsValidator } from '../../types';
import { createResource } from '../../createResource';
import { validateResourceIds } from './validateResourceIds';

const validator: ResourceIdsValidator = {
  type: 'resource-ids',
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
    it('throws if the resource is not registered', () => {
      // Validate using a validator for which the resource is not registered.
      // Should throw a validation error.
      expect(() =>
        validateResourceIds({ ...validator, resource: 'unregistered' }, [
          'document-id',
        ]),
      ).toThrowError(ValidationError);
    });

    it('throws if the value is not an array', () => {
      // Validate a non-array value. Should throw a `ValidationError`.
      expect(() => validateResourceIds(validator, 'document-id')).toThrowError(
        ValidationError,
      );
    });

    it('throws if the value contains an invalid item', () => {
      // Validate an array value containing an invalid item tyoe.
      // Should throw a `ValidationError`.
      expect(() => validateResourceIds(validator, [1234])).toThrowError(
        ValidationError,
      );
    });

    it('throws if a resource document does not exist', () => {
      // Validate an array of resource IDs containing the ID of a resource
      // document which does not exist. Should throw a `ValidationError`.
      expect(() => validateResourceIds(validator, ['missing'])).toThrowError(
        ValidationError,
      );
    });
  });

  describe('valid', () => {
    it('passes if the resource is registered and the all document exists', () => {
      // Create a couple of test documents
      const document1 = ResourceApi.create(core, {});
      const document2 = ResourceApi.create(core, {});

      // Validate the document IDs
      expect(() =>
        validateResourceIds(validator, [document1.id, document2.id]),
      ).not.toThrow();
    });
  });
});
