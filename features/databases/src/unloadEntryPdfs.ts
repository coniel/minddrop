import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';

/**
 * Removes the annotations and the page last read of an entry's pdf
 * properties from the pdf stores.
 *
 * @param entry - The entry.
 */
export function unloadEntryPdfs(entry: DatabaseEntry): void {
  // Unload each pdf file's annotations and page last read
  DatabaseEntries.propertyFiles(entry, { propertyTypes: ['pdf'] }).forEach(
    ({ path }) => {
      PdfAnnotations.unload(path);
      Pdf.unloadReadPage(path);
    },
  );
}
