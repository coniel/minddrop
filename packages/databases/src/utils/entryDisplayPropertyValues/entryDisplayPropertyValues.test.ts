import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DefaultContainerElementStyle,
  DefaultTextElementStyle,
  DefaultViewElementStyle,
  Design,
} from '@minddrop/designs';
import { ViewFixtures } from '@minddrop/views';
import {
  cleanup,
  collectionEntry1,
  objectEntry1,
  propertyStorageEntry1,
  setup,
} from '../../test-utils';
import { getPropertyFilePath } from '../getPropertyFilePath';
import { virtualViewId } from '../virtualViewId';
import { entryDisplayPropertyValues } from './entryDisplayPropertyValues';

const { viewType_table } = ViewFixtures;

// Design with a view element for collection property tests
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
    ],
  },
};

// Simple design with no view elements
const simpleDesign: Design = {
  id: 'simple-design',
  type: 'card',
  name: 'Simple Design',
  created: new Date(),
  lastModified: new Date(),
  tree: {
    id: 'root',
    type: 'root',
    style: { ...DefaultContainerElementStyle },
    children: [
      {
        id: 'text-element-1',
        type: 'text',
        style: { ...DefaultTextElementStyle },
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

    const expectedPath = getPropertyFilePath(
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
      'Related',
      designWithView.id,
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
    expect(result.Related).toEqual(['related-entry-1', 'related-entry-2']);
  });
});
