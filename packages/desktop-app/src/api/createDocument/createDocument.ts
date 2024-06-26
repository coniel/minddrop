import { i18n } from '@minddrop/i18n';
import { Document, Documents } from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';

/**
 * Creates a new "Untitled" document and its associated markdown file
 * in the specified parent directory.
 *
 * @param parentPath - The path to the parent directory.
 * @param fileType - The file type of the document.
 * @returns The newly created document.
 */
export async function createDocument(
  parentPath: string,
  fileType: string,
): Promise<Document> {
  // Use 'Untitled' as the default document title
  let title = i18n.t('documents.untitled');

  const { increment } = await Fs.incrementalPath(
    Fs.concatPath(parentPath, `${title}.${fileType}`),
  );

  if (increment) {
    title = `${title} ${increment}`;
  }

  return await Documents.create(parentPath, fileType, title);
}
