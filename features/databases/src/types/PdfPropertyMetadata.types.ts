import { PdfAnnotation } from '@minddrop/pdf';

/**
 * The metadata an entry keeps for one of its pdf properties.
 */
export type PdfPropertyMetadata = {
  /**
   * The document's highlight annotations.
   */
  annotations?: PdfAnnotation[];

  /**
   * The page last read, 1-based.
   */
  page?: number;
};
