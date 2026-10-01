/**
 * The page of a document last read.
 */
export interface PdfDocumentReadPage {
  /**
   * The absolute path of the PDF file.
   */
  path: string;

  /**
   * The page last read, 1-based.
   */
  page: number;
}
