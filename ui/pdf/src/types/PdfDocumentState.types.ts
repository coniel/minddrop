import { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfPageSize } from './PdfPageSize.types';

/**
 * The state of a loading or loaded PDF document.
 */
export interface PdfDocumentState {
  /**
   * The loaded document, null while loading or after a failure.
   */
  document: PDFDocumentProxy | null;

  /**
   * The number of pages in the document, 0 while unloaded.
   */
  pageCount: number;

  /**
   * The size of the document's first page in points, null while
   * unloaded.
   */
  pageSize: PdfPageSize | null;

  /**
   * The error the document failed to load with, null otherwise.
   */
  error: Error | null;
}
