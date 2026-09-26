import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  setup,
} from '../../test-utils';
import { updateCustomContentType } from '../../updateCustomContentType';
import { findCustomContentTypeByUrl } from './findCustomContentTypeByUrl';

describe('findCustomContentTypeByUrl', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the URL type with a domain the URL matches', () => {
    expect(findCustomContentTypeByUrl('https://github.com/foo')).toEqual(
      customContentType_url_1,
    );
    expect(findCustomContentTypeByUrl('https://docs.gitlab.com')).toEqual(
      customContentType_url_1,
    );
  });

  it('returns the URL type for a subdomain of a listed domain', () => {
    expect(findCustomContentTypeByUrl('https://gist.github.com/foo')).toEqual(
      customContentType_url_1,
    );
  });

  it('ignores file types', () => {
    // Give the file type a domain-like matcher
    updateCustomContentType(customContentType_file_1.id, {
      matchers: ['example.com'],
    });

    expect(findCustomContentTypeByUrl('https://example.com')).toBeNull();
  });

  it('returns null when the URL matches no URL type', () => {
    expect(findCustomContentTypeByUrl('https://wikipedia.org')).toBeNull();
  });
});
