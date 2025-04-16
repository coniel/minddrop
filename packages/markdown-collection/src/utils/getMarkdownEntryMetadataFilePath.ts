import { CollectionEntry } from '@minddrop/collections';
import { Fs } from '@minddrop/file-system';
import { MarkdownCollectionMetadataDir } from '../../constants';

export function getMarkdownEntryMetadataFilePath(
  entry: CollectionEntry,
): string {
  const entryFileName = entry.path.split('/').pop() || '';
  const metadataFileName = entryFileName.replace(/\.md$/, '.json');

  return Fs.concatPath(
    entry.collectionPath,
    MarkdownCollectionMetadataDir,
    metadataFileName,
  );
}
