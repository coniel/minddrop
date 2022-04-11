import { validateResourceReference } from './validateResourceReference';
import { ResourceValidationError } from '../../errors';

describe('validateResourceReference', () => {
  it('throws if the `resource` is missing', () => {
    // Validate a resource reference wihtout a `resource` property.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference(
        // @ts-ignore
        { id: 'id' },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if the `resource` is an empty string', () => {
    // Validate a resource reference with an empty string as the `resource`
    // property. Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference({ resource: '', id: 'id' }),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if the `resource` is not a string', () => {
    // Validate a resource reference with an invalid `resource` property.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference({
        // @ts-ignore
        resource: 123,
        id: 'id',
      }),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if the `id` is missing', () => {
    // Validate a resource reference wihtout an `id` property.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference(
        // @ts-ignore
        { resource: 'topic' },
      ),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if the `id` is an empty string', () => {
    // Validate a resource reference with an empty string as the `id`
    // property. Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference({ resource: 'topic', id: '' }),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if the `id` is not a string', () => {
    // Validate a resource reference with an invalid `id` property.
    // Should throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference({
        resource: 'topic',
        // @ts-ignore
        id: 123,
      }),
    ).toThrowError(ResourceValidationError);
  });

  it('throws if there are any other properties present besides `resource` and `id`', () => {
    // Validate a resource reference with an additional property. Should
    // throw a `ResourceValidationError`.
    expect(() =>
      validateResourceReference({
        resource: 'topic',
        id: 'id',
        // @ts-ignore
        foo: 'bar',
      }),
    ).toThrowError(ResourceValidationError);
  });
});
