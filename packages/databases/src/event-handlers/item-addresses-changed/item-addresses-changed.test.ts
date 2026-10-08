import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { History } from '@minddrop/history';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { EntriesStore } from '../../EntriesStore';
import { ensureEntryVirtualView } from '../../ensureEntryVirtualView';
import { sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  entryFilePath,
  getRecordedSqlStatements,
  historyAction_databaseRenamed,
  relatedEntry1,
  relatedEntry2,
  relatedPropertyName,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import {
  embeddedViewConfigKey,
  resolveEntryAddress,
  resolveEntryHistorySubject,
  resolveEntryPath,
  virtualCollectionId,
} from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// The renamed state of relatedEntry1, used as the change's new address
const renamedRelated = {
  ...relatedEntry1,
  title: 'Renamed Related',
  path: `${collectionDatabase.path}/Renamed Related.md`,
};

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { contentViewType_referencing, contentView_virtual_1 } =
  ContentViewFixtures;

// The ID of the design element embedding a view for the Related
// collection, and the key its config is persisted under.
const embeddingElementId = 'element_related';
const embeddingConfigKey = embeddedViewConfigKey(
  embeddingElementId,
  contentViewType_referencing.type,
);

describe('onItemAddressesChanged', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed the database record the changed entries belong to
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
        properties: collectionDatabase.properties,
      },
      { silent: true },
    );

    // Drop the seeding statements so tests only see the handler's SQL
    clearRecordedSqlStatements();
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it("rewrites referencing entries' files with current addresses", async () => {
    // Simulate a rename of a referenced entry
    EntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
    });

    const contents = MockFs.readTextFile(entryFilePath(collectionEntry1));

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related');
    expect(contents).not.toContain('Collection Database/Related Entry 1');
  });

  it('re-persists embedded view configs referencing changed items', async () => {
    // Create an embedded view referencing the renamed entry
    const view = ensureEntryVirtualView(
      virtualCollectionId(collectionEntry1.id, relatedPropertyName),
      embeddingElementId,
      contentViewType_referencing.type,
    );
    ContentViews.updateData(view.id, { items: [relatedEntry1.id] });

    // Rename the referenced entry
    EntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
    });

    // The embedded config should have the entry's new durable address
    expect(
      storeItem(EntriesStore, collectionEntry1.id).metadata
        .embeddedViewConfigs?.[embeddingConfigKey],
    ).toEqual({
      options: contentViewType_referencing.defaultOptions,
      data: {
        items: [resolveEntryAddress(renamedRelated, collectionDatabase)],
      },
    });
  });

  it("re-persists the embedded view configs of the changes' workspace", async () => {
    // The database and its entries held by the second workspace as
    // well, with the referenced entry already renamed there.
    DatabasesStore.in(workspace_2.id).set(collectionDatabase);
    EntriesStore.in(workspace_2.id).load([collectionEntry1, renamedRelated]);

    // An embedded view referencing the renamed entry, in the second
    // workspace alone.
    ContentViews.Store.in(workspace_2.id).set({
      ...contentView_virtual_1,
      id: 'view_second-workspace',
      type: contentViewType_referencing.type,
      owner: collectionEntry1.id,
      ownerKey: embeddingConfigKey,
      data: { items: [relatedEntry1.id] },
      references: [relatedEntry1.id],
    });

    await onItemAddressesChanged({
      workspaceId: workspace_2.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
    });

    // The second workspace's entry should have the config. The active
    // workspace's should be untouched.
    expect(
      EntriesStore.in(workspace_2.id).get(collectionEntry1.id)?.metadata
        .embeddedViewConfigs?.[embeddingConfigKey],
    ).toEqual({
      data: {
        items: [resolveEntryAddress(renamedRelated, collectionDatabase)],
      },
    });
    expect(
      storeItem(EntriesStore, collectionEntry1.id).metadata.embeddedViewConfigs,
    ).toBeUndefined();
  });

  it("rewrites the referencing entries of the changes' workspace", async () => {
    // The database and its entries held by the second workspace as
    // well, with the referenced entry already renamed there.
    DatabasesStore.in(workspace_2.id).set(collectionDatabase);
    EntriesStore.in(workspace_2.id).load([
      collectionEntry1,
      renamedRelated,
      relatedEntry2,
    ]);

    await onItemAddressesChanged({
      workspaceId: workspace_2.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
    });

    // The referencing file under the second workspace holds the new
    // address, the active workspace's file is untouched.
    expect(
      MockFs.readTextFile(
        resolveEntryPath(
          collectionEntry1,
          collectionDatabase,
          workspace_2.path,
        ),
      ),
    ).toContain('Collection Database/Renamed Related');
    expect(MockFs.readTextFile(entryFilePath(collectionEntry1))).not.toContain(
      'Collection Database/Renamed Related',
    );
  });

  it('does nothing for unreferenced items', async () => {
    const before = MockFs.readTextFile(entryFilePath(collectionEntry1));

    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: 'database-entry_unreferenced',
          oldReference: 'old',
          newReference: 'new',
        },
      ],
    });

    expect(MockFs.readTextFile(entryFilePath(collectionEntry1))).toBe(before);

    // No entry upsert statements should have been executed
    const entryUpserts = getRecordedSqlStatements().filter((statement) =>
      statement.sql.includes('INSERT OR REPLACE INTO entries'),
    );

    expect(entryUpserts).toEqual([]);
  });

  it('records the change against entries which reference it', async () => {
    // Simulate a rename of a referenced entry
    EntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
    });

    // The referencing entry's history should be able to follow its
    // older records to the new address.
    expect(
      await History.read(
        resolveEntryHistorySubject(collectionDatabase, collectionEntry1),
      ),
    ).toContainEqual(
      expect.objectContaining({
        kind: 'rename',
        target: 'reference',
        from: resolveEntryAddress(relatedEntry1, collectionDatabase),
        to: resolveEntryAddress(renamedRelated, collectionDatabase),
      }),
    );
  });

  it("stamps the changes' action on the referencing entries' records", async () => {
    // Simulate a rename of a referenced entry
    EntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: resolveEntryAddress(relatedEntry1, collectionDatabase),
          newReference: resolveEntryAddress(renamedRelated, collectionDatabase),
        },
      ],
      action: historyAction_databaseRenamed,
    });

    // The referencing entry's record should have the action
    expect(
      await History.read(
        resolveEntryHistorySubject(collectionDatabase, collectionEntry1),
      ),
    ).toEqual([
      expect.objectContaining({ action: historyAction_databaseRenamed }),
    ]);
  });
});
