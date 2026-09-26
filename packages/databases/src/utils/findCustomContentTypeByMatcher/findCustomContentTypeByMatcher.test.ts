import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  setup,
} from '../../test-utils';
import { findCustomContentTypeByMatcher } from './findCustomContentTypeByMatcher';

describe('findCustomContentTypeByMatcher', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the type of the kind listing the matcher', () => {
    expect(
      findCustomContentTypeByMatcher(
        'file',
        customContentType_file_1.matchers[1],
      ),
    ).toEqual(customContentType_file_1);
    expect(
      findCustomContentTypeByMatcher(
        'url',
        customContentType_url_1.matchers[0],
      ),
    ).toEqual(customContentType_url_1);
  });

  it('normalizes the matcher', () => {
    expect(
      findCustomContentTypeByMatcher(
        'file',
        `.${customContentType_file_1.matchers[0].toUpperCase()}`,
      ),
    ).toEqual(customContentType_file_1);
  });

  it('returns null when no type of the kind lists the matcher', () => {
    expect(
      findCustomContentTypeByMatcher(
        'url',
        customContentType_file_1.matchers[0],
      ),
    ).toBeNull();
    expect(findCustomContentTypeByMatcher('file', 'epub')).toBeNull();
  });
});
