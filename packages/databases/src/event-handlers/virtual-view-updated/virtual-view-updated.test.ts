import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { View } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { viewMetadataKey } from '../../utils';
import { onUpdateVirtualView } from './virtual-view-updated';

const designId = 'design-card-1';
const propertyName = 'Related';
const viewId = `${objectEntry1.id}:${propertyName}:${designId}`;

const baseView: View = {
  id: viewId,
  virtual: true,
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

  it('does nothing for non-virtual views', () => {
    const nonVirtualView: View = { ...baseView, virtual: false };

    onUpdateVirtualView({
      original: nonVirtualView,
      updated: { ...nonVirtualView, data: { columns: [] } },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('does nothing if the virtual view ID cannot be parsed', () => {
    const invalidIdView: View = { ...baseView, id: 'invalid-id' };

    onUpdateVirtualView({
      original: invalidIdView,
      updated: { ...invalidIdView, data: { columns: [] } },
    });

    // Entry metadata should remain unchanged
    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    expect(entry.metadata).toEqual({});
  });

  it('does nothing if the entry does not exist', () => {
    const unknownEntryView: View = {
      ...baseView,
      id: `Unknown/Entry.md:${propertyName}:${designId}`,
    };

    // Should not throw
    onUpdateVirtualView({
      original: unknownEntryView,
      updated: { ...unknownEntryView, data: { columns: [] } },
    });
  });

  it('updates the entry metadata with the view config', () => {
    const updatedView: View = {
      ...baseView,
      options: { sortOrder: 'asc' },
      data: { columns: [['a', 'b'], ['c']] },
    };

    onUpdateVirtualView({
      original: baseView,
      updated: updatedView,
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;
    const metadataKey = viewMetadataKey(propertyName, designId);

    expect(entry.metadata.views?.[metadataKey]).toEqual({
      options: { sortOrder: 'asc' },
      data: { columns: [['a', 'b'], ['c']] },
    });
  });

  it('preserves existing view configs for other keys', () => {
    // Set up existing metadata on the entry
    const existingMetadata = {
      views: {
        'Tasks:other-design': {
          options: { layout: 'grid' },
        },
      },
    };

    DatabaseEntriesStore.set({
      ...objectEntry1,
      metadata: existingMetadata,
    });

    const updatedView: View = {
      ...baseView,
      data: { columns: [] },
    };

    onUpdateVirtualView({
      original: baseView,
      updated: updatedView,
    });

    const entry = DatabaseEntriesStore.get(objectEntry1.id)!;

    // Existing config should be preserved
    expect(entry.metadata.views?.['Tasks:other-design']).toEqual({
      options: { layout: 'grid' },
    });

    // New config should be added
    expect(
      entry.metadata.views?.[viewMetadataKey(propertyName, designId)],
    ).toEqual({
      data: { columns: [] },
    });
  });
});
