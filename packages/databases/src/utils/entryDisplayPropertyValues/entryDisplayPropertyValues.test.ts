import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Layout } from '@minddrop/designs';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  propertyStorageEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';
import { virtualViewId } from '../virtualViewId';
import { entryDisplayPropertyValues } from './entryDisplayPropertyValues';

const { dataViewType_table } = DataViewFixtures;

// Layout with a collection element for collection property tests
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
    ],
  },
};

// Simple layout with no collection elements
const simpleDesign: Layout = {
  id: 'layout_simple',
  type: 'card',
  name: 'Simple Layout',
  frame: { x: 0, y: 0, width: 380 },
  created: new Date(),
  lastModified: new Date(),
  tree: {
    id: 'root',
    type: 'root',
    style: {},
    children: [
      {
        id: 'text-element-1',
        type: 'text',
        style: {},
      },
    ],
  },
};

describe('entryDisplayPropertyValues', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns empty object if entry does not exist', () => {
    const result = entryDisplayPropertyValues(
      'nonexistent-entry',
      simpleDesign,
      {},
    );

    expect(result).toEqual({});
  });

  it('returns empty object if database does not exist', () => {
    const result = entryDisplayPropertyValues(
      'nonexistent-entry',
      simpleDesign,
      {},
    );

    expect(result).toEqual({});
  });

  it('includes entry title as the Title property', () => {
    const result = entryDisplayPropertyValues(
      objectEntry1.id,
      simpleDesign,
      {},
    );

    expect(result.Title).toBe(objectEntry1.title);
  });

  it('includes raw property values', () => {
    const result = entryDisplayPropertyValues(
      objectEntry1.id,
      simpleDesign,
      {},
    );

    expect(result.Content).toBe(objectEntry1.properties.Content);
    expect(result.Icon).toBe(objectEntry1.properties.Icon);
  });

  it('replaces image file names with full file paths', () => {
    const result = entryDisplayPropertyValues(
      propertyStorageEntry1.id,
      simpleDesign,
      {},
    );

    const expectedPath = resolveEntryPropertyFilePath(
      propertyStorageEntry1.id,
      'Image',
      'image.png',
    );

    expect(result.Image).toBe(expectedPath);
  });

  it('replaces collection values with virtual view IDs', () => {
    const propertyMap: Record<string, string> = {
      'view-element-1': 'Related',
    };

    const result = entryDisplayPropertyValues(
      collectionEntry1.id,
      designWithView,
      propertyMap,
    );

    const expectedViewId = virtualViewId(
      collectionEntry1.id,
      designWithView.id,
      'Related',
    );

    expect(result.Related).toBe(expectedViewId);
  });

  it('does not replace collection values when not mapped to a view', () => {
    // No property map means no view elements are mapped
    const result = entryDisplayPropertyValues(
      collectionEntry1.id,
      designWithView,
      {},
    );

    // The raw collection value should remain
    expect(result.Related).toEqual([relatedEntry1.id, relatedEntry2.id]);
  });
});
