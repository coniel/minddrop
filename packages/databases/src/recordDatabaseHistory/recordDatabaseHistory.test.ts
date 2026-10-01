import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { History } from '@minddrop/history';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseHistorySubjectType } from '../constants';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { recordDatabaseHistory } from './recordDatabaseHistory';

const { databaseDirPath, objectDatabase } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('recordDatabaseHistory', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the change against the database's own history", async () => {
    // Record a change
    await recordDatabaseHistory(objectDatabase, { kind: 'created' });

    // The database's history should contain the change
    expect(
      await History.read({
        ownerPath: databaseDirPath(objectDatabase),
        subjectType: DatabaseHistorySubjectType,
      }),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });

  it('returns the recorded change', async () => {
    // Record a change
    const record = await recordDatabaseHistory(objectDatabase, {
      kind: 'created',
    });

    // The returned change should be the one in the database's history
    expect(
      await History.read({
        ownerPath: databaseDirPath(objectDatabase),
        subjectType: DatabaseHistorySubjectType,
      }),
    ).toEqual([record]);
  });

  it('records the change in the given workspace', async () => {
    // Record a change in the second workspace
    await recordDatabaseHistory(
      objectDatabase,
      { kind: 'created' },
      workspace_2.path,
    );

    // The database's history in the second workspace should contain it
    expect(
      await History.read({
        ownerPath: `${workspace_2.path}/${objectDatabase.path}`,
        subjectType: DatabaseHistorySubjectType,
      }),
    ).toEqual([expect.objectContaining({ kind: 'created' })]);
  });
});
