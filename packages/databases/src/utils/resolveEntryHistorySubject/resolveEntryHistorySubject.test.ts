import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryHistorySubjectType } from '../../constants';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveEntryHistorySubject } from './resolveEntryHistorySubject';

const { objectDatabase, objectEntry1, parentDir } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('resolveEntryHistorySubject', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the entry's subject in its database", () => {
    expect(resolveEntryHistorySubject(objectDatabase, objectEntry1)).toEqual({
      ownerPath: `${parentDir}/${objectDatabase.path}`,
      subjectType: EntryHistorySubjectType,
      subjectKey: objectEntry1.title,
    });
  });

  it('resolves the owner path against the given workspace', () => {
    expect(
      resolveEntryHistorySubject(objectDatabase, objectEntry1, workspace_2.path)
        .ownerPath,
    ).toBe(`${workspace_2.path}/${objectDatabase.path}`);
  });
});
