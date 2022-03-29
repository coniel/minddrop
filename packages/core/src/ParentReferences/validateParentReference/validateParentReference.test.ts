import { validateParentReference } from './validateParentReference';
import { ParentReferenceValidationError } from '../../errors';

describe('validateParentReference', () => {
  it('throws if the `type` is missing', () => {
    // Validate an parent reference wihtout a `type` property.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference(
        // @ts-ignore
        { id: 'id' },
      ),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('throws if the `type` is an empty string', () => {
    // Validate an parent reference with an empty string as the `type`
    // property. Should throw a `ParentReferenceValidationError`.
    expect(() => validateParentReference({ type: '', id: 'id' })).toThrowError(
      ParentReferenceValidationError,
    );
  });

  it('throws if the `type` is not a string', () => {
    // Validate an parent reference with an invalid `type` property.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference({
        // @ts-ignore
        type: 123,
        id: 'id',
      }),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('throws if the `id` is missing', () => {
    // Validate an parent reference wihtout an `id` property.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference(
        // @ts-ignore
        { type: 'topic' },
      ),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('throws if the `id` is an empty string', () => {
    // Validate an parent reference with an empty string as the `id`
    // property. Should throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference({ type: 'topic', id: '' }),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('throws if the `id` is not a string', () => {
    // Validate an parent reference with an invalid `id` property.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference({
        type: 'topic',
        // @ts-ignore
        id: 123,
      }),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('throws if there are any other properties present besides `type` and `id`', () => {
    // Validate a parent reference with an additional property. Should
    // throw a `ParentReferenceValidationError`.
    expect(() =>
      validateParentReference({
        type: 'topic',
        id: 'id',
        // @ts-ignore
        foo: 'bar',
      }),
    ).toThrowError(ParentReferenceValidationError);
  });
});
