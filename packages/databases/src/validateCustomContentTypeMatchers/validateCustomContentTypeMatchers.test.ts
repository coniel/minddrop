import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  setup,
} from '../test-utils';
import { validateCustomContentTypeMatchers } from './validateCustomContentTypeMatchers';

describe('validateCustomContentTypeMatchers', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('accepts free matchers', () => {
    expect(() =>
      validateCustomContentTypeMatchers('file', ['epub']),
    ).not.toThrow();
    expect(() =>
      validateCustomContentTypeMatchers('url', ['wikipedia.org']),
    ).not.toThrow();
  });

  it('rejects extensions of built-in file content types', () => {
    expect(() => validateCustomContentTypeMatchers('file', ['png'])).toThrow(
      InvalidParameterError,
    );
  });

  it('rejects matchers listed by another custom type of the kind', () => {
    expect(() =>
      validateCustomContentTypeMatchers(
        'file',
        customContentType_file_1.matchers,
      ),
    ).toThrow(InvalidParameterError);
    expect(() =>
      validateCustomContentTypeMatchers(
        'url',
        customContentType_url_1.matchers,
      ),
    ).toThrow(InvalidParameterError);
  });

  it('accepts matchers listed by a custom type of another kind', () => {
    expect(() =>
      validateCustomContentTypeMatchers(
        'url',
        customContentType_file_1.matchers,
      ),
    ).not.toThrow();
  });

  it("accepts the type's own matchers", () => {
    expect(() =>
      validateCustomContentTypeMatchers(
        'file',
        customContentType_file_1.matchers,
        customContentType_file_1.id,
      ),
    ).not.toThrow();
  });
});
