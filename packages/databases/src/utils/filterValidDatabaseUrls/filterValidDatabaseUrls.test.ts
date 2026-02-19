import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, objectDatabase, setup, urlDatabase } from '../../test-utils';
import { filterValidDatabaseUrls } from './filterValidDatabaseUrls';

describe('filterValidDatabaseUrls', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all URLs as invalid if database has no url properties', () => {
    const result = filterValidDatabaseUrls(objectDatabase.id, [
      'https://example.com',
    ]);

    expect(result.validUrls).toEqual([]);
    expect(result.invalidUrls).toEqual(['https://example.com']);
  });

  it('returns all URLs as valid if database has url properties', () => {
    const result = filterValidDatabaseUrls(urlDatabase.id, [
      'https://example.com',
    ]);

    expect(result.validUrls).toEqual(['https://example.com']);
    expect(result.invalidUrls).toEqual([]);
  });
});
