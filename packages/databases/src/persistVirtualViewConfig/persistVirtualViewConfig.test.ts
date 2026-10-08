import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentView } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { ensureEntryVirtualView } from '../ensureEntryVirtualView';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  relatedPropertyName,
  setup,
} from '../test-utils';
import {
  embeddedViewConfigKey,
  resolveEntryAddress,
  virtualCollectionId,
} from '../utils';
import { persistVirtualViewConfig } from './persistVirtualViewConfig';

const { contentViewType_table, contentViewType_referencing } =
  ContentViewFixtures;
const { workspace_2 } = WorkspaceFixtures;

// The virtual collection of the entry's Related property
const collectionId = virtualCollectionId(
  collectionEntry1.id,
  relatedPropertyName,
);

// The ID of the design element embedding the view
const elementId = 'element_related';

// The key the table's config is persisted under
const configKey = embeddedViewConfigKey(elementId, contentViewType_table.type);

// The embedded table, created before each test
let tableView: ContentView;

describe('persistVirtualViewConfig', () => {
  beforeEach(() => {
    setup();

    // Create the embedded table for the collection
    tableView = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_table.type,
    );
  });

  afterEach(cleanup);

  it('persists the config under the owner key', async () => {
    await persistVirtualViewConfig({
      ...tableView,
      options: { sortProperty: 'Name' },
      data: { columns: [] },
    });

    expect(
      storeItem(EntriesStore, collectionEntry1.id).metadata
        .embeddedViewConfigs?.[configKey],
    ).toEqual({ options: { sortProperty: 'Name' }, data: { columns: [] } });
  });

  it('serializes item references into durable form', async () => {
    // Create a referencing view for the collection
    const referencingView = ensureEntryVirtualView(
      collectionId,
      elementId,
      contentViewType_referencing.type,
    );

    await persistVirtualViewConfig({
      ...referencingView,
      data: { items: [relatedEntry1.id] },
    });

    // The persisted config should have the entry's durable address
    expect(
      storeItem(EntriesStore, collectionEntry1.id).metadata
        .embeddedViewConfigs?.[
        embeddedViewConfigKey(elementId, contentViewType_referencing.type)
      ],
    ).toEqual({
      options: contentViewType_referencing.defaultOptions,
      data: {
        items: [resolveEntryAddress(relatedEntry1, collectionDatabase)],
      },
    });
  });

  it("preserves the entry's other metadata and view configs", async () => {
    // The key of another element's saved config
    const otherKey = embeddedViewConfigKey(
      'element_tasks',
      contentViewType_table.type,
    );

    EntriesStore.set({
      ...collectionEntry1,
      metadata: {
        color: 'red',
        embeddedViewConfigs: {
          [otherKey]: { options: { sortProperty: 'Other' } },
        },
      },
    });

    await persistVirtualViewConfig({ ...tableView, data: { columns: [] } });

    const { metadata } = storeItem(EntriesStore, collectionEntry1.id);

    expect(metadata.color).toBe('red');
    expect(metadata.embeddedViewConfigs?.[otherKey]).toEqual({
      options: { sortProperty: 'Other' },
    });
    expect(metadata.embeddedViewConfigs?.[configKey]).toEqual({
      options: contentViewType_table.defaultOptions,
      data: { columns: [] },
    });
  });

  it("persists the config into the given workspace's entry", async () => {
    // The entry and its database held by the second workspace as well
    DatabasesStore.in(workspace_2.id).set(collectionDatabase);
    EntriesStore.in(workspace_2.id).set(collectionEntry1);

    await persistVirtualViewConfig(
      { ...tableView, data: { columns: [] } },
      workspace_2.id,
    );

    // The second workspace's entry should have the config. The active
    // workspace's should be untouched.
    expect(
      EntriesStore.in(workspace_2.id).get(collectionEntry1.id)?.metadata
        .embeddedViewConfigs?.[configKey],
    ).toEqual({
      options: contentViewType_table.defaultOptions,
      data: { columns: [] },
    });
    expect(storeItem(EntriesStore, collectionEntry1.id).metadata).toEqual({});
  });

  it('skips views without an owner', async () => {
    await persistVirtualViewConfig({
      ...tableView,
      owner: undefined,
      data: { columns: [] },
    });

    expect(storeItem(EntriesStore, collectionEntry1.id).metadata).toEqual({});
  });

  it('skips views not owned by a database entry', async () => {
    await persistVirtualViewConfig({
      ...tableView,
      owner: collectionDatabase.id,
      data: { columns: [] },
    });

    expect(storeItem(EntriesStore, collectionEntry1.id).metadata).toEqual({});
  });

  it('skips views without an owner key', async () => {
    await persistVirtualViewConfig({
      ...tableView,
      ownerKey: undefined,
      data: { columns: [] },
    });

    expect(storeItem(EntriesStore, collectionEntry1.id).metadata).toEqual({});
  });

  it('skips views whose entry no longer exists', async () => {
    await expect(
      persistVirtualViewConfig({
        ...tableView,
        owner: 'database-entry_unknown',
        data: { columns: [] },
      }),
    ).resolves.toBeUndefined();
  });
});
