import { Document, Documents } from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';

/**
 * Creates a new "Untitled" document and its associated file
 * in the specified parent directory.
 *
 * @param parentPath - The path to the parent directory.
 * @returns The newly created document.
 */
export async function createDocument(parentPath: string): Promise<Document> {
  // Use 'Untitled' as the default document title
  let title = i18n.t('documents.untitled');

  const { increment } = await Fs.incrementalPath(
    Fs.concatPath(parentPath, `${title}.minddrop`),
  );

  if (increment) {
    title = `${title} ${increment}`;
  }

  return await Documents.create(parentPath, title);
}
