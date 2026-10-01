import { DatabaseEntries } from '@minddrop/databases';
import { PdfPropertyMetadata } from '../types';

/**
 * Persists the page of a document last read to the metadata of the
 * entry property holding the document. Does nothing for a document no
 * entry property holds.
 *
 * @param path - The absolute path of the PDF file.
 * @param page - The page last read, 1-based.
 */
export async function persistEntryPdfReadPage(
  path: string,
  page: number,
): Promise<void> {
  // Find the entry property holding the document
  const owner = DatabaseEntries.findPropertyFileOwner(path);

  if (!owner) {
    return;
  }

  // Get the page the property's metadata records
  const { page: recordedPage } =
    DatabaseEntries.getPropertyMetadata<PdfPropertyMetadata>(
      owner.entryId,
      owner.property,
    );

  // Check if the page changed. If not, there is nothing to persist.
  if (recordedPage === page) {
    return;
  }

  // Update the property's metadata
  await DatabaseEntries.updatePropertyMetadata(owner.entryId, owner.property, {
    page,
  });
}
