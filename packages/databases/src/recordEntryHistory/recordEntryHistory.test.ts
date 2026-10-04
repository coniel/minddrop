import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntryHistorySubjectType } from '../constants';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { recordEntryHistory } from './recordEntryHistory';

const { databaseDirPath, objectDatabase, objectEntry1 } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('recordEntryHistory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the change against the entry's history", async () => {
    // Record a change
    await recordEntryHistory(objectDatabase, objectEntry1, {
      kind: 'created',
    });

    // The entry's history should contain the change
    expect(
      await History.read({
        ownerPath: databaseDirPath(objectDatabase),
        subjectType: EntryHistorySubjectType,
        subjectKey: objectEntry1.title,
      }),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });

  it('returns the recorded change', async () => {
    // Record a change
    const record = await recordEntryHistory(objectDatabase, objectEntry1, {
      kind: 'created',
    });

    // The returned change should be the one in the entry's history
    expect(
      await History.read({
        ownerPath: databaseDirPath(objectDatabase),
        subjectType: EntryHistorySubjectType,
        subjectKey: objectEntry1.title,
      }),
    ).toEqual([record]);
  });

  it('records the change in the given workspace', async () => {
    // Record a change in the second workspace
    await recordEntryHistory(
      objectDatabase,
      objectEntry1,
      { kind: 'created' },
      workspace_2.path,
    );

    // The entry's history in the second workspace should contain it
    expect(
      await History.read({
        ownerPath: `${workspace_2.path}/${objectDatabase.path}`,
        subjectType: EntryHistorySubjectType,
        subjectKey: objectEntry1.title,
      }),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });
});
