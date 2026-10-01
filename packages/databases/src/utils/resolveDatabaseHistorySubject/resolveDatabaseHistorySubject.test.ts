import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseHistorySubjectType } from '../../constants';
import { DatabaseFixtures, cleanup, setup } from '../../test-utils';
import { resolveDatabaseHistorySubject } from './resolveDatabaseHistorySubject';

const { databaseDirPath, objectDatabase } = DatabaseFixtures;
const { workspace_2 } = WorkspaceFixtures;

describe('resolveDatabaseHistorySubject', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the database's own subject", () => {
    expect(resolveDatabaseHistorySubject(objectDatabase)).toEqual({
      ownerPath: databaseDirPath(objectDatabase),
      subjectType: DatabaseHistorySubjectType,
    });
  });

  it('resolves the owner path against the given workspace', () => {
    expect(
      resolveDatabaseHistorySubject(objectDatabase, workspace_2.path).ownerPath,
    ).toBe(`${workspace_2.path}/${objectDatabase.path}`);
  });
});
