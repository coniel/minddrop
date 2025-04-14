import { Collection, CollectionConfigDirName } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { MarkdownCollectionMetadataDir } from '../../constants';

export const collectionPath = 'Notes';
export const collectionMetadataPath = Fs.concatPath(
  collectionPath,
  MarkdownCollectionMetadataDir,
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
