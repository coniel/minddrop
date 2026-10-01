import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setDatabaseContentDefault } from '../../setDatabaseContentDefault';
import {
  cleanup,
  customContentType_url_1,
  objectDatabase,
  setup,
  urlDatabase,
} from '../../test-utils';
import { updateCustomContentType } from '../../updateCustomContentType';
import { resolveDefaultDatabaseIdForUrl } from './resolveDefaultDatabaseIdForUrl';

// A URL on a domain the custom URL type lists
const customTypeUrl = `https://${customContentType_url_1.matchers[0]}/foo`;

describe('resolveDefaultDatabaseIdForUrl', () => {
  beforeEach(() => {
    setup();

    // Set the URL default
    setDatabaseContentDefault('url', urlDatabase.id);
  });

  afterEach(cleanup);

  it('returns the database of the custom type matching the URL', () => {
    // Set the custom type's database
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: objectDatabase.id,
    });

    expect(resolveDefaultDatabaseIdForUrl(customTypeUrl)).toBe(
      objectDatabase.id,
    );
  });

  it('returns the URL default when no custom type matches', () => {
    expect(resolveDefaultDatabaseIdForUrl('https://example.com')).toBe(
      urlDatabase.id,
    );
  });

  it('returns the URL default when the matching custom type has no database', () => {
    expect(resolveDefaultDatabaseIdForUrl(customTypeUrl)).toBe(urlDatabase.id);
  });

  it('returns null when no default applies', () => {
    // Unset the URL default
    setDatabaseContentDefault('url', null);

    expect(resolveDefaultDatabaseIdForUrl('https://example.com')).toBeNull();
  });

  it('prefers a target database which can hold the URL over the defaults', () => {
    // Give the custom type's URLs another database
    updateCustomContentType(customContentType_url_1.id, {
      databaseId: objectDatabase.id,
    });

    expect(resolveDefaultDatabaseIdForUrl(customTypeUrl, urlDatabase.id)).toBe(
      urlDatabase.id,
    );
  });

  it('ignores a target database which cannot hold the URL', () => {
    expect(
      resolveDefaultDatabaseIdForUrl('https://example.com', objectDatabase.id),
    ).toBe(urlDatabase.id);
  });

  it('ignores a target database which does not exist', () => {
    expect(
      resolveDefaultDatabaseIdForUrl('https://example.com', 'missing-database'),
    ).toBe(urlDatabase.id);
  });
});
