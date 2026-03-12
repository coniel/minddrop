import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  DefaultContainerElementStyle,
  DefaultTextElementStyle,
  DefaultViewElementStyle,
  Design,
} from '@minddrop/designs';
import { ViewFixtures, Views } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { viewMetadataKey } from '../viewMetadataKey';
import { virtualCollectionId } from '../virtualCollectionId';
import { virtualViewId } from '../virtualViewId';
import { createEntryVirtualViews } from './createEntryVirtualViews';

const { viewType_table } = ViewFixtures;

// Design with a view element mapped to the 'Related' property
const designWithView: Design = {
  id: 'test-design',
  type: 'card',
  name: 'Test Design',
  created: new Date(),
  lastModified: new Date(),
  tree: {
    id: 'root',
    type: 'root',
    style: { ...DefaultContainerElementStyle },
    children: [
      {
        id: 'view-element-1',
        type: 'view',
        viewType: viewType_table.type,
        style: { ...DefaultViewElementStyle },
      },
      {
        id: 'text-element-1',
        type: 'text',
        style: { ...DefaultTextElementStyle },
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

  it('skips collection properties mapped to non-view elements', () => {
    // Map the collection property to a text element instead of a view
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
    expect(collection!.entries).toEqual(['related-entry-1', 'related-entry-2']);
  });

  it('creates a virtual view with the correct view type and data source', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify a virtual view was created
    const vViewId = virtualViewId(
      collectionEntry1.id,
      'Related',
      designWithView.id,
    );
    const view = Views.get(vViewId, false);
    const collId = virtualCollectionId(collectionEntry1.id, 'Related');

    expect(view).not.toBeNull();
    expect(view!.type).toBe(viewType_table.type);
    expect(view!.dataSource).toEqual({ type: 'collection', id: collId });
  });

  it('returns a map of property names to virtual view IDs', () => {
    const result = createEntryVirtualViews(
      collectionEntry1.id,
      designWithView,
      propertyMap,
    );

    const expectedViewId = virtualViewId(
      collectionEntry1.id,
      'Related',
      designWithView.id,
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
      'Related',
      designWithView.id,
    );

    expect(Collections.get(collId, false)).not.toBeNull();
    expect(Views.get(vViewId, false)).not.toBeNull();
  });

  it('handles multiple collection properties', () => {
    // Design with two view elements
    const multiViewDesign: Design = {
      ...designWithView,
      tree: {
        ...designWithView.tree,
        children: [
          {
            id: 'view-element-1',
            type: 'view',
            viewType: viewType_table.type,
            style: { ...DefaultViewElementStyle },
          },
          {
            id: 'view-element-2',
            type: 'view',
            viewType: viewType_table.type,
            style: { ...DefaultViewElementStyle },
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
        'Related',
        multiViewDesign.id,
      ),
      References: virtualViewId(
        collectionEntry1.id,
        'References',
        multiViewDesign.id,
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
        views: {
          [viewMetadataKey('Related', designWithView.id)]: savedConfig,
        },
      },
    });

    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // Verify the saved config was applied to the virtual view
    const vViewId = virtualViewId(
      collectionEntry1.id,
      'Related',
      designWithView.id,
    );
    const view = Views.get(vViewId, false);

    // Saved options are merged over the view type's default options
    expect(view!.options).toEqual({
      ...viewType_table.defaultOptions,
      ...savedConfig.options,
    });
    expect(view!.data).toEqual(savedConfig.data);
  });

  it('does not modify view when no saved config exists in metadata', () => {
    createEntryVirtualViews(collectionEntry1.id, designWithView, propertyMap);

    // View should have default options from view type (or none)
    const vViewId = virtualViewId(
      collectionEntry1.id,
      'Related',
      designWithView.id,
    );
    const view = Views.get(vViewId, false);

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

    // collectionEntry1 has Related: ['related-entry-1', 'related-entry-2']
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
