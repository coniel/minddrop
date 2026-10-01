import { PdfZoom } from '@minddrop/pdf';

/**
 * Stringifies a zoom.
 *
 * @param zoom - The zoom.
 * @returns The zoom as a string.
 */
export function stringifyPdfZoom(zoom: PdfZoom): string {
  return typeof zoom === 'number' ? String(zoom) : zoom;
}
