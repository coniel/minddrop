import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  entryStorageDatabase,
  objectDatabase,
  setup,
} from '../../test-utils';
import { isEntryFilePath } from './isEntryFilePath';

describe('isEntryFilePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("accepts a file with the serializer's extension at the database root", () => {
    expect(isEntryFilePath('Dune.md', objectDatabase)).toBe(true);
  });

  it('rejects a file of another type', () => {
    expect(isEntryFilePath('Cover.png', objectDatabase)).toBe(false);
  });

  it('rejects a nested file in a database storing entries at its root', () => {
    expect(isEntryFilePath('Notes/Dune.md', objectDatabase)).toBe(false);
  });

  it("accepts a file in an entry's own directory in a database storing entries in directories", () => {
    expect(isEntryFilePath('Dune/Dune.md', entryStorageDatabase)).toBe(true);
  });

  it('rejects a file nested deeper than an entry directory', () => {
    expect(isEntryFilePath('Dune/Notes/Dune.md', entryStorageDatabase)).toBe(
      false,
    );
  });

  it('rejects hidden files and files in hidden directories', () => {
    expect(isEntryFilePath('.Dune.md', objectDatabase)).toBe(false);
    expect(isEntryFilePath('.obsidian/Dune.md', entryStorageDatabase)).toBe(
      false,
    );
  });
});
