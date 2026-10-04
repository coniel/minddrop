import { parseAnchorFragment } from '@minddrop/ast';
import { DatabaseEntries, Entry } from '@minddrop/databases';
import { PdfAnnotations } from '@minddrop/pdf';

export interface EntryPdfAnchor {
  /**
   * The absolute path of the PDF file holding the annotation.
   */
  path: string;

  /**
   * The ID of the annotation.
   */
  annotationId: string;
}

/**
 * Resolves the annotation of one of an entry's pdf files a link
 * fragment names.
 *
 * @param entry - The entry.
 * @param fragment - The link fragment.
 * @returns The annotation's file path and ID, or null when the fragment names no annotation of the entry's pdf files.
 */
export function resolveEntryPdfAnchor(
  entry: Entry,
  fragment: string,
): EntryPdfAnchor | null {
  // Parse the annotation ID from the anchor
  const annotationId = parseAnchorFragment(fragment);

  if (!annotationId) {
    return null;
  }

  // Find the pdf file holding the annotation
  const file = DatabaseEntries.propertyFiles(entry, {
    propertyTypes: ['pdf'],
  }).find(({ path }) => PdfAnnotations.get(path, annotationId, false));

  return file ? { path: file.path, annotationId } : null;
}
