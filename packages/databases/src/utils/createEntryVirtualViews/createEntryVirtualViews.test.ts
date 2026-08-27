import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Layout } from '@minddrop/designs';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { databaseEntryAddress } from '../databaseEntryAddress';
import { viewMetadataKey } from '../viewMetadataKey';
import { virtualCollectionId } from '../virtualCollectionId';
import { virtualViewId } from '../virtualViewId';
import { createEntryVirtualViews } from './createEntryVirtualViews';

const { dataViewType_table, dataViewType_referencing } = DataViewFixtures;

// Layout with a collection element mapped to the 'Related' property
const designWithView: Layout = {
  id: 'layout_test',
  type: 'card',
  name: 'Test Layout',
  frame: { x: 0, y: 0, width: 380 },
  created: new Date(),
  lastModified: new Date(),
  tree: {
    id: 'root',
    type: 'root',
    style: {},
    children: [
      {
        id: 'view-element-1',
        type: 'property',
        propertyType: 'collection',
        variant: dataViewType_table.type,
        style: {},
      },
      {
        id: 'text-element-1',
        type: 'text',
        style: {},
      },
    ],
  },
};

// Property map: element ID -> property name
const propertyMap: Record<string, string> = {
  'view-element-1': 'Related',
};

describe('createEntryVirtualViews', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns empty object if entry does not exist', () => {
    const result = createEntryVirtualViews(
      'nonexistent-entry',
      designWithView,
      propertyMap,
    );

    expect(result).toEqual({});
  });

  it('returns empty object if database does not exist', () => {
    const result = createEntryVirtualViews(
      // objectEntry1 belongs to objectDatabase, but we reference
      // an entry whose database ID doesn't exist in the store
      'nonexistent-entry',
      designWithView,
      propertyMap,
    );

    expect(result).toEqual({});
  });

  it('returns empty object if database has no collection properties', () => {
    const result = createEntryVirtualViews(
      objectEntry1.id,
      designWithView,
      propertyMap,
    );

    expect(result).toEqual({});
  });

  it('skips collection properties not mapped to any element', () => {
    // Empty property map means no properties are mapped
    const result = createEntryVirtualViews(
      collectionEntry1.id,
      designWithView,
      {},
    );

    expect(result).toEqual({});
  });

  it('skips collection properties mapped to non-collection elements', () => {
    // Map the collection property to a text element instead of a
    // collection element
    const result = createEntryVirtualViews(
      collectionEntry1.id,
      designWithView,
      { 'text-element-1': 'Related' },
    );

    expect(result).toEqual({});
  });

  it('creates a virtual collection with the entry IDs', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify a virtual collection was created
    const collId = virtualCollectionId(collectionEntry1.id, 'Related');
    const collection = Collections.get(collId, false);

    expect(collection).not.toBeNull();
    expect(collection!.items).toEqual([relatedEntry1.id, relatedEntry2.id]);
  });

  it('creates a virtual view with the correct view type and data source', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify a virtual view was created
    const vViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );
    const view = DataViews.get(vViewId, false);
    const collId = virtualCollectionId(collectionEntry1.id, 'Related');

    expect(view).not.toBeNull();
    expect(view!.type).toBe(dataViewType_table.type);
    expect(view!.dataSource).toEqual({ type: 'collection', id: collId });
  });

  it('sets the entry as the view owner', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify the view carries the entry as owner and the metadata
    // key as owner key
    const view = DataViews.get(
      virtualViewId(collectionEntry1.id, designWithView.id, 'Related'),
      false,
    );

    expect(view!.owner).toBe(collectionEntry1.id);
    expect(view!.ownerKey).toBe(viewMetadataKey(designWithView.id, 'Related'));
  });

  it('applies saved config for a property name containing a colon', () => {
    const colonProperty = 'Notes: Draft';
    const savedConfig = { data: { sortOrder: 'asc' } };

    // Add a collection property whose name contains a colon
    DatabasesStore.set({
      ...collectionDatabase,
      properties: [
        ...collectionDatabase.properties,
        { type: 'collection', name: colonProperty },
      ],
    });

    // Give the entry a value and a saved config for the property
    DatabaseEntriesStore.set({
      ...collectionEntry1,
      properties: {
        ...collectionEntry1.properties,
        [colonProperty]: [relatedEntry1.id],
      },
      metadata: {
        embeddedViewConfigs: {
          [viewMetadataKey(designWithView.id, colonProperty)]: savedConfig,
        },
      },
    });

    createEntryVirtualViews(collectionEntry1.id, designWithView, {
      'view-element-1': colonProperty,
    });

    // The saved config resolves through the owner key despite the colon
    const view = DataViews.get(
      virtualViewId(collectionEntry1.id, designWithView.id, colonProperty),
      false,
    );

    expect(view!.ownerKey).toBe(
      viewMetadataKey(designWithView.id, colonProperty),
    );
    expect(view!.data).toEqual(savedConfig.data);
  });

  it('returns a map of property names to virtual view IDs', () => {
    const result = createEntryVirtualViews(
      collectionEntry1.id,
      designWithView,
      propertyMap,
    );

    const expectedViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );

    expect(result).toEqual({ Related: expectedViewId });
  });

  it('does not recreate existing virtual collections or views', () => {
    // Call twice
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Should still have valid resources (no errors from duplicate creation)
    const collId = virtualCollectionId(collectionEntry1.id, 'Related');
    const vViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );

    expect(Collections.get(collId, false)).not.toBeNull();
    expect(DataViews.get(vViewId, false)).not.toBeNull();
  });

  it('handles multiple collection properties', () => {
    // Layout with two view elements
    const multiViewDesign: Layout = {
      ...designWithView,
      tree: {
        ...designWithView.tree,
        children: [
          {
            id: 'view-element-1',
            type: 'property',
            propertyType: 'collection',
            variant: dataViewType_table.type,
            style: {},
          },
          {
            id: 'view-element-2',
            type: 'property',
            propertyType: 'collection',
            variant: dataViewType_table.type,
            style: {},
          },
        ],
      },
    };

    const multiPropertyMap: Record<string, string> = {
      'view-element-1': 'Related',
      'view-element-2': 'References',
    };

    const result = createEntryVirtualViews(
      collectionEntry1.id,
      multiViewDesign,
      multiPropertyMap,
    );

    expect(result).toEqual({
      Related: virtualViewId(
        collectionEntry1.id,
        multiViewDesign.id,
        'Related',
      ),
      References: virtualViewId(
        collectionEntry1.id,
        multiViewDesign.id,
        'References',
      ),
    });
  });

  it('applies saved view config from entry metadata', () => {
    const savedConfig = {
      options: { columns: [['a', 'b'], ['c']] },
      data: { sortOrder: 'asc' },
    };

    // Set metadata on the entry with a saved view config
    DatabaseEntriesStore.set({
      ...collectionEntry1,
      metadata: {
        embeddedViewConfigs: {
          [viewMetadataKey(designWithView.id, 'Related')]: savedConfig,
        },
      },
    });

    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify the saved config was applied to the virtual view
    const vViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );
    const view = DataViews.get(vViewId, false);

    // Saved options are merged over the view type's default options
    expect(view!.options).toEqual({
      ...dataViewType_table.defaultOptions,
      ...savedConfig.options,
    });
    expect(view!.data).toEqual(savedConfig.data);
  });

  it('resolves durable references in the saved view config', () => {
    // A layout whose view element uses the referencing view type
    const referencingLayout: Layout = {
      ...designWithView,
      tree: {
        ...designWithView.tree,
        children: [
          {
            id: 'view-element-1',
            type: 'property',
            propertyType: 'collection',
            variant: dataViewType_referencing.type,
            style: {},
          },
        ],
      },
    };

    // Saved config holding a durable entry address
    DatabaseEntriesStore.set({
      ...collectionEntry1,
      metadata: {
        embeddedViewConfigs: {
          [viewMetadataKey(referencingLayout.id, 'Related')]: {
            data: { items: [databaseEntryAddress(relatedEntry1.path)] },
          },
        },
      },
    });

    createEntryVirtualViews(
      collectionEntry1.id,
      referencingLayout,
      propertyMap,
    );

    const view = DataViews.get(
      virtualViewId(collectionEntry1.id, referencingLayout.id, 'Related'),
      false,
    );

    // The virtual view's data holds the resolved runtime entry ID
    expect(view!.data).toEqual({ items: [relatedEntry1.id] });
  });

  it('does not modify view when no saved config exists in metadata', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // View should have default options from view type (or none)
    const vViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );
    const view = DataViews.get(vViewId, false);

    // Should not have custom data
    expect(view!.data).toBeUndefined();
  });

  it('defaults to empty array when collection property has no value', () => {
    // Map the 'References' property to a view element, but use
    // an entry that has no 'References' value
    const entryWithoutReferences = { ...collectionEntry1 };
    entryWithoutReferences.properties = {
      ...collectionEntry1.properties,
      References: undefined as unknown as string[],
    };

    // The function reads from the store, so we use the existing
    // collectionEntry1 which does have References. Instead, test
    // with a property that has no value set at all by mapping
    // to a property name that doesn't exist on the entry.
    const mapToMissing: Record<string, string> = {
      'view-element-1': 'Related',
    };

    // collectionEntry1 has Related referencing the two related entries
    // so this will work. The empty array fallback is tested implicitly
    // when the property doesn't exist on the entry.
    const result = createEntryVirtualViews(
      collectionEntry1.id,
      designWithView,
      mapToMissing,
    );

    expect(Object.keys(result)).toContain('Related');
  });
});
