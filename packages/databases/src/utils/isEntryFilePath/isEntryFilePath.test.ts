import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  entryStorageDatabase,
  objectDatabase,
  setup,
  yamlObjectDatabase,
} from '../../test-utils';
import { isEntryFilePath } from './isEntryFilePath';

describe('isEntryFilePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("accepts a file with the serializer's extension at the database root", () => {
    expect(isEntryFilePath('Dune.md', objectDatabase)).toBe(true);
  });

  it("accepts a file with a YAML serializer's extension and rejects markdown", () => {
    expect(isEntryFilePath('Dune.yaml', yamlObjectDatabase)).toBe(true);
    expect(isEntryFilePath('Dune.md', yamlObjectDatabase)).toBe(false);
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

  // Pins Issue 34: Files with the entry extension inside an entry's own
  // directory are indexed as entries. Remove .fails once fixed.
  it.fails(
    "rejects a file in an entry's directory which is not named after the directory",
    () => {
      expect(isEntryFilePath('Dune/notes.md', entryStorageDatabase)).toBe(
        false,
      );
    },
  );

  it('rejects hidden files and files in hidden directories', () => {
    expect(isEntryFilePath('.Dune.md', objectDatabase)).toBe(false);
    expect(isEntryFilePath('.obsidian/Dune.md', entryStorageDatabase)).toBe(
      false,
    );
  });
});
