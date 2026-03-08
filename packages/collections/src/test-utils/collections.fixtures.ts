import { MockFileDescriptor } from '@minddrop/file-system';
import { Collection } from '../types';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';

function generateCollectionFixture(number: number): Collection {
  return {
    id: `collection-${number}`,
    name: `Collection ${number}`,
    created: new Date('2024-01-01T00:00:00.000Z'),
    lastModified: new Date('2024-01-01T00:00:00.000Z'),
    entries: [`entry-${number}-1`, `entry-${number}-2`],
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

export const collectionFiles: (string | MockFileDescriptor)[] = [
  getCollectionsDirPath(),
  ...collections.map((collection) => ({
    path: getCollectionFilePath(collection.id),
    textContent: JSON.stringify(collection),
  })),
];
