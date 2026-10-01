import { PdfAnnotationColor, PdfRect } from '@minddrop/pdf';
import { PdfClientRect } from './PdfClientRect.types';

/**
 * A highlight drawn over a page.
 */
export interface PdfHighlight {
  /**
   * The highlight's ID.
   */
  id: string;

  /**
   * The index of the page the highlight is on, 0-based.
   */
  page: number;

  /**
   * The highlighted regions in PDF user space, one per line.
   */
  rects: PdfRect[];

  /**
   * The highlight colour.
   */
  color: PdfAnnotationColor;
}

/**
 * A text selection within one page, resolved to page space.
 */
export interface PdfTextSelection {
  /**
   * The index of the page the selection is on, 0-based.
   */
  page: number;

  /**
   * The selected regions in PDF user space, one per line.
   */
  rects: PdfRect[];

  /**
   * The selected text, with its whitespace normalised.
   */
  text: string;

  /**
   * The selection's bounding box in the document column's CSS
   * pixels.
   */
  anchor: PdfClientRect;
}
