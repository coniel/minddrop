import { describe, expect, it } from 'vitest';
import {
  noPropertiesDatabase,
  objectDatabase,
  rootStorageDatabase,
  urlDatabase,
} from '../../test-utils';
import { filterDatabasesByContentType } from './filterDatabasesByContentType';

const databases = [
  objectDatabase,
  urlDatabase,
  rootStorageDatabase,
  noPropertiesDatabase,
];

describe('filterDatabasesByContentType', () => {
  it('returns the databases with a content property for text', () => {
    expect(filterDatabasesByContentType(databases, 'text')).toEqual([
      objectDatabase,
    ]);
  });

  it('returns the databases with a URL property for URLs', () => {
    expect(filterDatabasesByContentType(databases, 'url')).toEqual([
      urlDatabase,
    ]);
  });

  it('returns the databases with a file property for files', () => {
    expect(filterDatabasesByContentType(databases, 'pdf')).toEqual([
      rootStorageDatabase,
    ]);
  });
});
