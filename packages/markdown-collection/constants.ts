import { CollectionConfigDirName } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';

export const MarkdownCollectionMetadataDir = Fs.concatPath(
  CollectionConfigDirName,
  'metadata',
);
