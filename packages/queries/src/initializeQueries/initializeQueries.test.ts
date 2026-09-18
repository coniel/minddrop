import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { QueriesStore } from '../QueriesStore';
import { QueryEntityType, QueryGroupsType } from '../constants';
import { QueryDeletedEvent } from '../events';
import { cleanup, query_1, setup } from '../test-utils';
import { resolveQueryFilePath } from '../utils';
import { initializeQueries } from './initializeQueries';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeQueries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('applies query file changes made outside of the app', async () => {
    initializeQueries();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveQueryFilePath(query_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(QueriesStore).not.toHaveItem(query_1.id);
  });

  it('registers the query groups type', () => {
    // The fixtures register the type, so drop it to see the
    // initialization put it back.
    EntityGroups.unregisterType(QueryGroupsType);

    initializeQueries();

    expect(EntityGroups.getConfig(QueryGroupsType).id).toBe(QueryGroupsType);
  });

  it('lets a query group hold only queries', () => {
    initializeQueries();

    expect(EntityGroups.getConfig(QueryGroupsType).itemTypes).toEqual([
      QueryEntityType,
    ]);
  });

  it('files a query under one group at most', () => {
    initializeQueries();

    expect(EntityGroups.getConfig(QueryGroupsType).multiMembership).toBeFalsy();
  });

  it('gives the queries in no group an ungrouped group', () => {
    initializeQueries();

    expect(EntityGroups.getConfig(QueryGroupsType).ungrouped).toBe(true);
  });

  it('drops a deleted query from the group holding it', () => {
    initializeQueries();

    expect(EntityGroups.getConfig(QueryGroupsType).itemDeletedEvents).toEqual([
      QueryDeletedEvent,
    ]);
  });
});
