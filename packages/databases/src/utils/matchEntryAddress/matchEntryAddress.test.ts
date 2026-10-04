import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { matchEntryAddress } from './matchEntryAddress';

const { workspace_2 } = WorkspaceFixtures;

describe('matchEntryAddress', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches the database and entry named by the address', () => {
    expect(
      matchEntryAddress(`${objectDatabase.name}/${objectEntry1.title}`),
    ).toEqual({ database: objectDatabase, entry: objectEntry1 });
  });

  it('matches case-insensitively', () => {
    expect(
      matchEntryAddress(
        `${objectDatabase.name.toLowerCase()}/${objectEntry1.title.toLowerCase()}`,
      ),
    ).toEqual({ database: objectDatabase, entry: objectEntry1 });
  });

  it('matches a database holding no entry under the title with a null entry', () => {
    expect(matchEntryAddress(`${objectDatabase.name}/New entry`)).toEqual({
      database: objectDatabase,
      entry: null,
    });
  });

  it('does not match an entry belonging to another database', () => {
    expect(
      matchEntryAddress(`${objectDatabase.name}/Reference Entry 1`),
    ).toEqual({ database: objectDatabase, entry: null });
  });

  it('returns null when the first segment names no database', () => {
    expect(matchEntryAddress('Unknown/Entry')).toBeNull();
  });

  it('returns null for addresses that are not two segments', () => {
    expect(matchEntryAddress(objectDatabase.name)).toBeNull();
    expect(
      matchEntryAddress(`${objectDatabase.name}/${objectEntry1.title}/Extra`),
    ).toBeNull();
  });

  it('returns null for addresses with an empty segment', () => {
    expect(matchEntryAddress(`/${objectEntry1.title}`)).toBeNull();
    expect(matchEntryAddress(`${objectDatabase.name}/`)).toBeNull();
  });

  it('matches against the given workspace', () => {
    expect(
      matchEntryAddress(
        `${objectDatabase.name}/${objectEntry1.title}`,
        workspace_2.id,
      ),
    ).toBeNull();
  });
});
