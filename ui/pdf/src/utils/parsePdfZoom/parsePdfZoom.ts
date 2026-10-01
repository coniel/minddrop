import { PdfZoom } from '@minddrop/pdf';

/**
 * Parses a stringified zoom back into the zoom it stands for.
 *
 * @param value - The zoom as a string.
 * @returns The zoom.
 */
export function parsePdfZoom(value: string): PdfZoom {
  // Return a fit mode as is
  if (value === 'fit-width' || value === 'fit-page') {
    return value;
  }

  // Parse a fixed zoom
  return Number(value);
}
