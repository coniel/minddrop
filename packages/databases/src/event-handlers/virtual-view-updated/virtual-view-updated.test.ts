import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import {
  databaseEntryAddress,
  viewMetadataKey,
  virtualViewId,
} from '../../utils';
import { onUpdateVirtualView } from './virtual-view-updated';

const { dataViewType_referencing } = DataViewFixtures;

const layoutId = 'layout-card-1';
const propertyName = 'Related';
const viewId = virtualViewId(objectEntry1.id, layoutId, propertyName);

const baseView: DataView = {
  id: viewId,
  virtual: true,
  owner: objectEntry1.id,
  ownerKey: viewMetadataKey(layoutId, propertyName),
  name: 'Related',
  type: 'board',
  icon: 'content-icon:shapes:blue',
  dataSource: { type: 'collection', id: 'collection-1' },
  created: new Date(),
  lastModified: new Date(),
};

describe('onUpdateVirtualView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('does nothing for views without an owner', () => {
    const unownedView: DataView = { ...baseView, owner: undefined };

    onUpdateVirtualView({
      original: unownedView,
      updated: { ...unownedView, data: { columns: [] } },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('does nothing for views not owned by a database entry', () => {
    const databaseOwnedView: DataView = {
      ...baseView,
      owner: 'database_some-database',
    };

    onUpdateVirtualView({
      original: databaseOwnedView,
      updated: { ...databaseOwnedView, data: { columns: [] } },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('does nothing if the entry does not exist', () => {
    const unknownEntryView: DataView = {
      ...baseView,
      owner: 'database-entry_unknown',
    };

    // Should not throw
    onUpdateVirtualView({
      original: unknownEntryView,
      updated: { ...unknownEntryView, data: { columns: [] } },
    });
  });

  it('updates the entry metadata with the view config', () => {
    const updatedView: DataView = {
      ...baseView,
      options: { sortOrder: 'asc' },
      data: { columns: [['a', 'b'], ['c']] },
    };

    onUpdateVirtualView({
      original: baseView,
      updated: updatedView,
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;
    const metadataKey = viewMetadataKey(layoutId, propertyName);

    expect(entry.metadata.embeddedViewConfigs?.[metadataKey]).toEqual({
      options: { sortOrder: 'asc' },
      data: { columns: [['a', 'b'], ['c']] },
    });
  });

  it('serializes item references into durable form', () => {
    // A virtual view referencing an entry via the referencing view
    // type's data
    const referencingView: DataView = {
      ...baseView,
      type: dataViewType_referencing.type,
      data: { items: [objectEntry1.id] },
    };

    onUpdateVirtualView({
      original: baseView,
      updated: referencingView,
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    // The persisted config holds the entry's durable address
    expect(
      entry.metadata.embeddedViewConfigs?.[
        viewMetadataKey(layoutId, propertyName)
      ],
    ).toEqual({ data: { items: [databaseEntryAddress(objectEntry1.path)] } });
  });

  it('preserves existing view configs for other keys', () => {
    // Set up existing metadata on the entry
    const existingMetadata = {
      embeddedViewConfigs: {
        'other-layout:Tasks': {
          options: { layout: 'grid' },
        },
      },
    };

    DatabaseEntriesStore.set({
      ...objectEntry1,
      metadata: existingMetadata,
    });

    const updatedView: DataView = {
      ...baseView,
      data: { columns: [] },
    };

    onUpdateVirtualView({
      original: baseView,
      updated: updatedView,
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    // Existing config should be preserved
    expect(entry.metadata.embeddedViewConfigs?.['other-layout:Tasks']).toEqual({
      options: { layout: 'grid' },
    });

    // New config should be added
    expect(
      entry.metadata.embeddedViewConfigs?.[
        viewMetadataKey(layoutId, propertyName)
      ],
    ).toEqual({
      data: { columns: [] },
    });
  });
});
