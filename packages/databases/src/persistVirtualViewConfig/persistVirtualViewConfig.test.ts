import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { cleanup, collectionEntry1, objectEntry1, setup } from '../test-utils';
import { viewMetadataKey, virtualViewId } from '../utils';
import { persistVirtualViewConfig } from './persistVirtualViewConfig';

const { dataViewType_table } = DataViewFixtures;

const layoutId = 'layout-card-1';
const propertyName = 'Related';

const baseView: DataView = {
  id: virtualViewId(objectEntry1.id, layoutId, propertyName),
  virtual: true,
  owner: objectEntry1.id,
  ownerKey: viewMetadataKey(layoutId, propertyName),
  name: propertyName,
  type: dataViewType_table.type,
  icon: 'content-icon:shapes:blue',
  dataSource: { type: 'collection', id: 'collection-1' },
  created: new Date(),
  lastModified: new Date(),
};

describe('persistVirtualViewConfig', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('persists the config under the owner key', async () => {
    // Persist a view with options and data
    await persistVirtualViewConfig({
      ...baseView,
      options: { sortBy: 'name' },
      data: { columns: [] },
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    // The config lands under the view's owner key
    expect(
      entry.metadata.embeddedViewConfigs?.[
        viewMetadataKey(layoutId, propertyName)
      ],
    ).toEqual({ options: { sortBy: 'name' }, data: { columns: [] } });
  });

  it('skips views without an owner', async () => {
    // Persist a view with no owner
    await persistVirtualViewConfig({
      ...baseView,
      owner: undefined,
      data: { columns: [] },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('skips views not owned by a database entry', async () => {
    // Persist a view owned by a database
    await persistVirtualViewConfig({
      ...baseView,
      owner: 'database_some-database',
      data: { columns: [] },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('skips views without an owner key', async () => {
    // Persist a view with no owner key
    await persistVirtualViewConfig({
      ...baseView,
      ownerKey: undefined,
      data: { columns: [] },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('skips views whose entry no longer exists', async () => {
    // Should not throw for an owner that is not in the store
    await persistVirtualViewConfig({
      ...baseView,
      owner: 'database-entry_unknown',
      data: { columns: [] },
    });
  });

  it('persists configs for property names containing colons', async () => {
    const colonProperty = 'Notes: Draft';

    // Persist a view for a colon-named property
    await persistVirtualViewConfig({
      ...baseView,
      id: virtualViewId(collectionEntry1.id, layoutId, colonProperty),
      owner: collectionEntry1.id,
      ownerKey: viewMetadataKey(layoutId, colonProperty),
      name: colonProperty,
      data: { sortOrder: 'asc' },
    });

    const entry = DatabaseEntriesStore.get(collectionEntry1.id)!;

    // The config lands under the colon-safe metadata key
    expect(
      entry.metadata.embeddedViewConfigs?.[
        viewMetadataKey(layoutId, colonProperty)
      ],
    ).toEqual({ data: { sortOrder: 'asc' } });
  });
});
