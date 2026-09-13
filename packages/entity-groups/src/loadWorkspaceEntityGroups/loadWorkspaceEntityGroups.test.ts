import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';
import { EntityGroupsDirName } from '../constants';
import { EntityGroupsLoadedEvent } from '../events';
import { getAllEntityGroups } from '../getAllEntityGroups';
import { getEntityGroup } from '../getEntityGroup';
import { EntityGroupFixtures, MockFs, cleanup, setup } from '../test-utils';
import { loadWorkspaceEntityGroups } from './loadWorkspaceEntityGroups';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_multi_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  groupsFilePath,
  itemAddresses,
} = EntityGroupFixtures;

const multiType = groupTypeConfig_multi.id;

const type = groupTypeConfig_exclusive.id;

describe('loadWorkspaceEntityGroups', () => {
  beforeEach(() => {
    setup();

    // The store starts empty, as it does before the groups load
    EntityGroupsStore.clear();
  });

  afterEach(cleanup);

  it('loads each registered type of groups', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);
    MockFs.writeJsonFile(groupsFilePath(groupTypeConfig_multi.id), [
      entityGroup_multi_1,
    ]);

    await loadWorkspaceEntityGroups(workspace_1);

    expect(getAllEntityGroups(type)).toEqual([entityGroup_exclusive_1]);
    expect(getAllEntityGroups(groupTypeConfig_multi.id)).toEqual([
      entityGroup_multi_1,
      entityGroup_protected,
    ]);
  });

  it("loads the groups into the workspace's store record", async () => {
    // Give the second workspace groups of its own
    MockFs.addFiles([
      {
        path: Fs.concatPath(
          workspace_2.path,
          Paths.hiddenDirName,
          EntityGroupsDirName,
          Fs.fileNameFromPath(groupsFilePath(type)),
        ),
        textContent: JSON.stringify([entityGroup_exclusive_1]),
      },
    ]);

    await loadWorkspaceEntityGroups(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(EntityGroupsStore.in(workspace_2.id).get(type)?.groups).toEqual([
      entityGroup_exclusive_1,
    ]);
    expect(EntityGroupsStore).not.toHaveItem(type);
  });

  it('resolves stored references back into item IDs', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [
      { ...entityGroup_exclusive_1, items: [itemAddresses[addressedItem_1]] },
    ]);

    await loadWorkspaceEntityGroups(workspace_1);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
    ]);
  });

  it('resolves stored references in the loaded workspace', async () => {
    // Register an adapter claiming 'scoped:' references, prefixing
    // resolved IDs with the workspace they were resolved in.
    ItemReferences.registerAdapter({
      type: 'scoped-item',
      serialize: (id) => id,
      match: (reference, workspaceId) => {
        if (!reference.startsWith('scoped:')) {
          return null;
        }

        return { type: 'scoped-item', id: `${workspaceId}:${reference}` };
      },
    });

    MockFs.writeJsonFile(groupsFilePath(type), [
      { ...entityGroup_exclusive_1, items: ['scoped:one'] },
    ]);

    await loadWorkspaceEntityGroups(workspace_1);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([
      `${workspace_1.id}:scoped:one`,
    ]);

    ItemReferences.unregisterAdapter('scoped-item');
  });

  it('drops stored references which no longer resolve', async () => {
    MockFs.writeJsonFile(groupsFilePath(type), [
      { ...entityGroup_exclusive_1, items: ['Addressed/Deleted item'] },
    ]);

    await loadWorkspaceEntityGroups(workspace_1);

    expect(getEntityGroup(type, entityGroup_exclusive_1.id).items).toEqual([]);
  });

  it('adds a type of app provided groups when none have been stored', async () => {
    await loadWorkspaceEntityGroups(workspace_1);

    expect(getAllEntityGroups(groupTypeConfig_multi.id)).toEqual([
      entityGroup_protected,
    ]);
  });

  it('leaves a type without app provided groups empty', async () => {
    await loadWorkspaceEntityGroups(workspace_1);

    expect(getAllEntityGroups(type)).toEqual([]);
  });

  it('restores an app provided group edited on disk', async () => {
    MockFs.writeJsonFile(groupsFilePath(groupTypeConfig_multi.id), [
      { ...entityGroup_protected, name: 'Renamed', items: [addressedItem_1] },
    ]);

    await loadWorkspaceEntityGroups(workspace_1);

    expect(getEntityGroup(multiType, entityGroup_protected.id)).toEqual(
      entityGroup_protected,
    );
  });

  it('dispatches the loaded event with every type of groups', async () =>
    new Promise<void>((done) => {
      MockFs.writeJsonFile(groupsFilePath(type), [entityGroup_exclusive_1]);

      Events.addListener(EntityGroupsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual([
          entityGroup_exclusive_1,
          entityGroup_protected,
        ]);
        done();
      });

      loadWorkspaceEntityGroups(workspace_1);
    }));

  it('loads nothing when no type is registered', async () => {
    EntityGroupTypesRegistry.clear();

    await loadWorkspaceEntityGroups(workspace_1);

    expect(EntityGroupsStore).toHaveItemCount(0);
  });
});
