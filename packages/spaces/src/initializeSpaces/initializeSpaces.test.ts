import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SpacesStore } from '../SpacesStore';
import { SpaceEntityType, SpaceGroupsType } from '../constants';
import { SpaceDeletedEvent } from '../events';
import { cleanup, setup, space_1 } from '../test-utils';
import { resolveSpaceFilePath } from '../utils';
import { initializeSpaces } from './initializeSpaces';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeSpaces', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('applies space bundle changes made outside of the app', async () => {
    initializeSpaces();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveSpaceFilePath(space_1.id),
      kind: 'deleted',
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(SpacesStore).not.toHaveItem(space_1.id);
  });

  it('registers the space groups type', () => {
    // The fixtures register the type, so drop it to see the
    // initialization put it back.
    EntityGroups.unregisterType(SpaceGroupsType);

    initializeSpaces();

    expect(EntityGroups.getConfig(SpaceGroupsType).id).toBe(SpaceGroupsType);
  });

  it('lets a space group hold only spaces', () => {
    initializeSpaces();

    expect(EntityGroups.getConfig(SpaceGroupsType).itemTypes).toEqual([
      SpaceEntityType,
    ]);
  });

  it('files a space under one group at most', () => {
    initializeSpaces();

    expect(EntityGroups.getConfig(SpaceGroupsType).multiMembership).toBeFalsy();
  });

  it('gives the spaces in no group an ungrouped group', () => {
    initializeSpaces();

    expect(EntityGroups.getConfig(SpaceGroupsType).ungrouped).toBe(true);
  });

  it('drops a deleted space from the group holding it', () => {
    initializeSpaces();

    expect(EntityGroups.getConfig(SpaceGroupsType).itemDeletedEvents).toEqual([
      SpaceDeletedEvent,
    ]);
  });
});
