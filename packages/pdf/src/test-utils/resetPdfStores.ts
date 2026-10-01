import { clearPdfAnnotationFocusRequest } from '../PdfAnnotationFocusRequestStore';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { PdfReadersStore } from '../PdfReadersStore';

/**
 * Clears the annotations, the read pages, the mounted readers and the
 * pending annotation focus request.
 */
export function resetPdfStores(): void {
  PdfAnnotationsStore.clear();
  PdfReadPagesStore.clear();
  PdfReadersStore.setState({ readers: [] });
  clearPdfAnnotationFocusRequest();
}
