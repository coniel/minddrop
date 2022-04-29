import { ValidationError } from '@minddrop/utils';
import { validateResourceReference } from './validateResourceReference';
import {
  ResourceConfig,
  ResourceDocument,
  ResourceReferenceValidator,
} from '../../types';
import { createResource } from '../../createResource';
import { cleanup, core, setup } from '../../test-utils';
import { ResourceApisStore } from '../../ResourceApisStore';

const validator: ResourceReferenceValidator = {
  type: 'resource-reference',
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
    it('throws if the `resource` is missing', () => {
      // Validate a resource reference wihtout a `resource` property.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, { id: document.id }),
      ).toThrowError(ValidationError);
    });

    it('throws if the `resource` is an empty string', () => {
      // Validate a resource reference with an empty string as the `resource`
      // property. Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, { resource: '', id: document.id }),
      ).toThrowError(ValidationError);
    });

    it('throws if the `resource` is not a string', () => {
      // Validate a resource reference with an invalid `resource` property.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 123,
          id: document.id,
        }),
      ).toThrowError(ValidationError);
    });

    it('throws if the `id` is missing', () => {
      // Validate a resource reference wihtout an `id` property.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, { resource: 'tests:test' }),
      ).toThrowError(ValidationError);
    });

    it('throws if the `id` is an empty string', () => {
      // Validate a resource reference with an empty string as the `id`
      // property. Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'tests:test',
          id: '',
        }),
      ).toThrowError(ValidationError);
    });

    it('throws if the `id` is not a string', () => {
      // Validate a resource reference with an invalid `id` property.
      // Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'tests:test',
          id: 123,
        }),
      ).toThrowError(ValidationError);
    });

    it('throws if there are any other properties present besides `resource` and `id`', () => {
      // Validate a resource reference with an additional property. Should
      // throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'tests:test',
          id: document.id,
          foo: 'bar',
        }),
      ).toThrowError(ValidationError);
    });

    it('throws if the resource is not registered', () => {
      // Validate a resource reference for which the resource is not
      // registered. Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'unregistered',
          id: document.id,
        }),
      ).toThrowError(ValidationError);
    });

    it('throws if the document does not exist', () => {
      // Validate a resource reference for which the document does not
      // exist. Should throw a `ValidationError`.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'tests:test',
          id: 'missing',
        }),
      ).toThrowError(ValidationError);
    });
  });

  describe('valid', () => {
    it('passes given a valid resource reference', () => {
      // Validate a valid resource reference. Should not throw an error.
      expect(() =>
        validateResourceReference(validator, {
          resource: 'tests:test',
          id: document.id,
        }),
      ).not.toThrow();
    });
  });
});
