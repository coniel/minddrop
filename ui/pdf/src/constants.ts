import { PdfHighlight } from './types';

// CSS pixels per PDF point. A zoom of 1 renders a page at its
// physical size on a 96 dpi screen.
export const PixelsPerPoint = 96 / 72;

// The zoom multiples the zoom controls step through, in order
export const ZoomPresets = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

// The space around and between pages, in CSS pixels
export const PagePadding = 16;

// The number of pages drawn on either side of the pages in view
export const DrawPageOverscan = 2;

// The number of pages on either side of the pages in view. Drawn pages
// within this distance stay drawn.
export const KeepPageOverscan = 3;

// An empty highlights list. Shared so that documents and pages
// without any keep a stable reference.
export const NoHighlights: PdfHighlight[] = [];

// The selector matching a page's slot in the document column
export const PageSlotSelector = '[data-page-number]';

// The selector matching a rendered page
export const PageSelector = '.pdf-page';
