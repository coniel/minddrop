import { ContentColor } from '@minddrop/ui-theme';

/**
 * A highlight colour: any content colour but the default.
 */
export type PdfAnnotationColor = Exclude<ContentColor, 'default'>;

/**
 * A rectangle in PDF user space, as `[llx, lly, urx, ury]`.
 * Independent of page scale and rotation.
 */
export type PdfRect = [number, number, number, number];

export interface PdfAnnotation {
  /**
   * The annotation's ID, unique within its document.
   */
  id: string;

  /**
   * The index of the page the annotation is on, 0-based.
   */
  page: number;

  /**
   * The highlighted regions, one per line of text.
   */
  rects: PdfRect[];

  /**
   * The highlighted text, with its whitespace normalised.
   */
  text: string;

  /**
   * The highlight colour.
   */
  color: PdfAnnotationColor;

  /**
   * When the annotation was created.
   */
  created: Date;

  /**
   * A note attached to the highlight.
   */
  note?: string;
}

/**
 * A document's annotations, as stored.
 */
export interface PdfDocumentAnnotations {
  /**
   * The absolute path of the PDF file the annotations belong to.
   */
  path: string;

  /**
   * The document's annotations, in creation order.
   */
  annotations: PdfAnnotation[];
}
