import { DatabaseEntries, Entry } from '@minddrop/databases';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';

/**
 * Re-keys the annotations and the page last read of an entry's pdf
 * properties in the pdf stores when a change to the entry moves their
 * files.
 *
 * @param original - The entry before the change.
 * @param updated - The entry after the change.
 */
export function moveEntryPdfs(original: Entry, updated: Entry): void {
  // Resolve the pdf files before the change
  const previousFiles = DatabaseEntries.propertyFiles(original, {
    propertyTypes: ['pdf'],
  });

  // Re-key the annotations and page of each pdf file which moved
  DatabaseEntries.propertyFiles(updated, { propertyTypes: ['pdf'] }).forEach(
    (file) => {
      // Find the property's file before the change
      const previous = previousFiles.find(
        (candidate) => candidate.property === file.property,
      );

      // Check whether the file moved. If so, re-key its state.
      if (previous && previous.path !== file.path) {
        PdfAnnotations.move(previous.path, file.path);
        Pdf.moveReadPage(previous.path, file.path);
      }
    },
  );
}
