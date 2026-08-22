import { MockFileDescriptor } from '@minddrop/file-system';
import { Collection } from '../types';

function generateCollectionFixture(number: number): Collection {
  return {
    id: `collection_${number}`,
    name: `Collection ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    items: [
      `database-entry_entry-${number}-1`,
      `database-entry_entry-${number}-2`,
    ],
  };
}

export const collection_1 = generateCollectionFixture(1);
export const collection_2 = generateCollectionFixture(2);
export const collection_3 = generateCollectionFixture(3);

export const collections = [collection_1, collection_2, collection_3];

function generateVirtualCollectionFixture(number: number): Collection {
  return {
    ...generateCollectionFixture(number),
    id: `virtual-collection-${number}`,
    virtual: true,
    name: `Virtual Collection ${number}`,
  };
}

export const collection_virtual_1 = generateVirtualCollectionFixture(1);
export const collection_virtual_2 = generateVirtualCollectionFixture(2);

export const collections_virtual = [collection_virtual_1, collection_virtual_2];

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce
const collectionsDirPath =
  'path/to/workspaces/Workspace 1/.minddrop/collections';

export function getCollectionFiles(): (string | MockFileDescriptor)[] {
  return [
    collectionsDirPath,
    ...collections.map((collection) => ({
      path: `${collectionsDirPath}/${collection.id}.json`,
      textContent: JSON.stringify(collection),
    })),
  ];
}
