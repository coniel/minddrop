import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { QueriesStore } from '../QueriesStore';
import { QueriesLoadedEvent } from '../events';
import { MockFs, cleanup, queries, setup } from '../test-utils';
import { resolveQueriesDirPath, resolveQueryFilePath } from '../utils';
import { loadWorkspaceQueries } from './loadWorkspaceQueries';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadWorkspaceQueries', () => {
  beforeEach(() => setup({ loadQueries: false }));

  afterEach(cleanup);

  it('creates the queries directory if it does not exist', async () => {
    // Remove the queries directory
    MockFs.removeFile(resolveQueriesDirPath());

    await loadWorkspaceQueries(workspace_1);

    expect(MockFs.exists(resolveQueriesDirPath())).toBe(true);
  });

  it('loads queries from the queries directory into the store', async () => {
    await loadWorkspaceQueries(workspace_1);

    expect(QueriesStore).toHaveItems(queries);
  });

  it("loads queries into the workspace's store record", async () => {
    const [query] = queries;

    // Give the second workspace a query of its own
    MockFs.addFiles([
      {
        path: resolveQueryFilePath(query.id, workspace_2.path),
        textContent: JSON.stringify(query),
      },
    ]);

    await loadWorkspaceQueries(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(QueriesStore.in(workspace_2.id).get(query.id)).toEqual(query);
    expect(QueriesStore).not.toHaveItem(query.id);
  });

  it('filters out null queries', async () => {
    // Create an invalid query file
    MockFs.writeTextFile(resolveQueryFilePath('invalid-query'), 'invalid json');

    await loadWorkspaceQueries(workspace_1);

    expect(QueriesStore).toHaveItems(queries);
  });

  it('dispatches a queries loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueriesLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(queries);
        done();
      });

      loadWorkspaceQueries(workspace_1);
    }));
});
