import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, objectEntry1, setup } from '../../test-utils';
import { matchEntryReference } from './matchEntryReference';

const { workspace_2 } = WorkspaceFixtures;

describe('matchEntryReference', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches an existing entry address to its entry ID', () => {
    expect(
      matchEntryReference(`${objectDatabase.name}/${objectEntry1.title}`),
    ).toEqual({ type: 'database-entry', id: objectEntry1.id });
  });

  it('matches case-insensitively', () => {
    expect(
      matchEntryReference(
        `${objectDatabase.name.toUpperCase()}/${objectEntry1.title.toUpperCase()}`,
      ),
    ).toEqual({ type: 'database-entry', id: objectEntry1.id });
  });

  it('matches a missing entry inside an existing database with a null ID', () => {
    expect(matchEntryReference(`${objectDatabase.name}/New entry`)).toEqual({
      type: 'database-entry',
      id: null,
    });
  });

  it('does not match addresses outside an existing database', () => {
    expect(matchEntryReference('Unknown/Entry')).toBeNull();
  });

  it('does not match addresses without a database segment', () => {
    expect(matchEntryReference(objectEntry1.title)).toBeNull();
  });

  it('does not match addresses with more than two segments', () => {
    expect(
      matchEntryReference(`${objectDatabase.name}/${objectEntry1.title}/Extra`),
    ).toBeNull();
  });

  it('does not match addresses with an empty segment', () => {
    expect(matchEntryReference(`${objectDatabase.name}/`)).toBeNull();
  });

  it('matches against the given workspace', () => {
    expect(
      matchEntryReference(
        `${objectDatabase.name}/${objectEntry1.title}`,
        workspace_2.id,
      ),
    ).toBeNull();
  });
});
