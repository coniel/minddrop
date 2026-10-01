import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import {
  PdfHighlight,
  PdfPageSize,
  PdfTextSelection,
  PdfViewportLike,
} from '../types';
import { resolveAnnotationHighlight } from '../utils';

const { pdfAnnotation_1, pdfAnnotation_2 } = PdfAnnotationFixtures;

// Page sizes in points
export const pdfPageSize_portrait: PdfPageSize = { width: 600, height: 800 };
export const pdfPageSize_landscape: PdfPageSize = { width: 800, height: 600 };

// A viewport rendering PDF user space one to one, without flipping
// the y axis.
export const pdfViewport_identity: PdfViewportLike = {
  convertToPdfPoint: (x, y) => [x, y],
  convertToViewportRectangle: (rect) => rect,
};

// The scale the scaled viewport renders the portrait page at
export const pdfViewportScale = 2;

// A viewport rendering the portrait page at twice its size, with the
// PDF y axis running up from the bottom.
export const pdfViewport_scaled: PdfViewportLike = {
  convertToPdfPoint: (x, y) => [
    x / pdfViewportScale,
    pdfPageSize_portrait.height - y / pdfViewportScale,
  ],
  convertToViewportRectangle: ([x1, y1, x2, y2]) => [
    x1 * pdfViewportScale,
    (pdfPageSize_portrait.height - y1) * pdfViewportScale,
    x2 * pdfViewportScale,
    (pdfPageSize_portrait.height - y2) * pdfViewportScale,
  ],
};

// The annotations as the highlights drawn for them
export const pdfHighlight_1: PdfHighlight =
  resolveAnnotationHighlight(pdfAnnotation_1);
export const pdfHighlight_2: PdfHighlight =
  resolveAnnotationHighlight(pdfAnnotation_2);

// A selection of the first annotation's passage
export const pdfTextSelection_1: PdfTextSelection = {
  page: pdfAnnotation_1.page,
  rects: pdfAnnotation_1.rects,
  text: pdfAnnotation_1.text,
  anchor: { left: 100, top: 200, width: 50, height: 20 },
};
