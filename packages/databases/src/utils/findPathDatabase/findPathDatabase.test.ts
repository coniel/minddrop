import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  databaseDirPath,
  objectDatabase,
  parentDir,
  setup,
} from '../../test-utils';
import { findPathDatabase } from './findPathDatabase';

const objectDatabasePath = databaseDirPath(objectDatabase);

describe('findPathDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds the database containing a path', () => {
    expect(findPathDatabase(`${objectDatabasePath}/Dune.md`)).toEqual(
      objectDatabase,
    );
  });

  it("finds the database of its own directory's path", () => {
    expect(findPathDatabase(objectDatabasePath)).toEqual(objectDatabase);
  });

  it('does not match a sibling directory sharing a name prefix', () => {
    expect(
      findPathDatabase(`${objectDatabasePath} Archive/Dune.md`),
    ).toBeNull();
  });

  it('returns null for a path in no database', () => {
    expect(findPathDatabase(`${parentDir}/Scratch/notes.txt`)).toBeNull();
  });
});
