import { DatabaseEntries, Entry } from '@minddrop/databases';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';
import { PdfPropertyMetadata } from '../types';

/**
 * Loads the annotations and the page last read an entry keeps for its
 * pdf properties into the pdf stores, under the properties' file
 * paths.
 *
 * @param entry - The entry.
 */
export function loadEntryPdfs(entry: Entry): void {
  // Load each pdf file's annotations and page last read
  DatabaseEntries.propertyFiles(entry, { propertyTypes: ['pdf'] }).forEach(
    ({ property, path }) => {
      // Get the property's metadata
      const { annotations = [], page } =
        DatabaseEntries.getPropertyMetadata<PdfPropertyMetadata>(
          entry.id,
          property,
        );

      // Load the annotations under the file's path
      PdfAnnotations.load(path, annotations);

      // Load the page last read, if one is recorded
      if (page) {
        Pdf.loadReadPage(path, page);
      }
    },
  );
}
