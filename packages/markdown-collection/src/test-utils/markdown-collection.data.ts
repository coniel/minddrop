import {
  Collection,
  CollectionConfigDirName,
  CollectionEntry,
} from '@minddrop/collections';
import { Fs, MockFileDescriptor } from '@minddrop/file-system';
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

export const markdownEntry: CollectionEntry = {
  path: `${collectionPath}/Entry 1.md`,
  collectionPath,
  title: 'Entry 1',
  content: '# Entry 1',
  properties: {
    foo: 'bar',
  },
  metadata: {
    created: new Date('2023-01-01'),
    lastModified: new Date('2023-01-01'),
  },
};

export const markdownEntryMedataFilePath = Fs.concatPath(
  collectionMetadataPath,
  `${markdownEntry.title}.json`,
);

export const markdownEntryFileDescriptor: MockFileDescriptor = {
  path: markdownEntry.path,
  textContent: `---\nfoo: bar\n---\n# Entry 1`,
};

export const markdownEntryMetadataFileDescriptor: MockFileDescriptor = {
  path: markdownEntryMedataFilePath,
  textContent: JSON.stringify(markdownEntry.metadata),
};

export const collectionFileDescriptors = [
  collectionPath,
  collectionMetadataPath,
];
