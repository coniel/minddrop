import { Collection, CollectionConfigDirName } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { MarkdownCollectionMetadataDirName } from '../../constants';

export const collectionPath = 'Notes';
export const collectionMetadataPath = Fs.concatPath(
  collectionPath,
  CollectionConfigDirName,
  MarkdownCollectionMetadataDirName,
);

export const markdownCollection: Collection = {
  path: collectionPath,
  type: 'markdown',
  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
  properties: [],
};

export const collectionFileDescriptors = [
  collectionPath,
  collectionMetadataPath,
];
