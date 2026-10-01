import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotation } from '../types';

/**
 * Returns a document's annotations, empty until they are loaded.
 *
 * @param path - The absolute path of the PDF file.
 * @returns The document's annotations.
 */
export function getPdfAnnotations(path: string): PdfAnnotation[] {
  return PdfAnnotationsStore.get(path)?.annotations ?? [];
}
