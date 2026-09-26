import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  setup,
} from '../../test-utils';
import { findContentTypeMatcherOwner } from './findContentTypeMatcherOwner';

describe('findContentTypeMatcherOwner', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the built-in file content type with the extension', () => {
    expect(findContentTypeMatcherOwner('file', '.PNG')).toBe('image');
  });

  it('returns the custom type of the kind listing the matcher', () => {
    expect(
      findContentTypeMatcherOwner('file', customContentType_file_1.matchers[0]),
    ).toEqual(customContentType_file_1);
    expect(
      findContentTypeMatcherOwner('url', customContentType_url_1.matchers[0]),
    ).toEqual(customContentType_url_1);
  });

  it("ignores the custom type's own matchers", () => {
    expect(
      findContentTypeMatcherOwner(
        'file',
        customContentType_file_1.matchers[0],
        customContentType_file_1.id,
      ),
    ).toBeNull();
  });

  it('ignores custom types of another kind', () => {
    expect(
      findContentTypeMatcherOwner('url', customContentType_file_1.matchers[0]),
    ).toBeNull();
  });

  it('returns null for a free matcher', () => {
    expect(findContentTypeMatcherOwner('file', 'epub')).toBeNull();
  });
});
