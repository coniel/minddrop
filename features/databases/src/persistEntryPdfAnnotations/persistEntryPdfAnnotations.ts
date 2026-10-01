import { DatabaseEntries } from '@minddrop/databases';
import { PdfAnnotations } from '@minddrop/pdf';
import { PdfPropertyMetadata } from '../types';

/**
 * Persists a document's annotations to the metadata of the entry
 * property holding the document. Does nothing for a document no entry
 * property holds.
 *
 * @param path - The absolute path of the PDF file.
 */
export async function persistEntryPdfAnnotations(path: string): Promise<void> {
  // Find the entry property holding the document
  const owner = DatabaseEntries.findPropertyFileOwner(path);

  if (!owner) {
    return;
  }

  // Build the property's metadata from the store
  const metadata: PdfPropertyMetadata = {
    annotations: PdfAnnotations.getAll(path),
  };

  // Update the property's metadata
  await DatabaseEntries.updatePropertyMetadata(
    owner.entryId,
    owner.property,
    metadata,
  );
}
