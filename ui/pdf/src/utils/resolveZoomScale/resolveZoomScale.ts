import { PdfZoom } from '@minddrop/pdf';
import { PagePadding, PixelsPerPoint } from '../../constants';
import { PdfPageSize } from '../../types';

/**
 * Resolves the scale pages render at for a zoom.
 *
 * @param zoom - The zoom to resolve.
 * @param pageSize - The size of the page the fit modes fit, in points.
 * @param viewportWidth - The width of the viewport, in CSS pixels.
 * @param viewportHeight - The height of the viewport, in CSS pixels.
 * @returns The scale, in CSS pixels per point.
 */
export function resolveZoomScale(
  zoom: PdfZoom,
  pageSize: PdfPageSize,
  viewportWidth: number,
  viewportHeight: number,
): number {
  // Scale a fixed zoom from the page's physical size
  if (typeof zoom === 'number') {
    return zoom * PixelsPerPoint;
  }

  // Resolve the scale at which the page fills the viewport's width,
  // less the padding on either side.
  const widthScale =
    Math.max(viewportWidth - PagePadding * 2, 0) / pageSize.width;

  // Return the width scale for the fit-width mode
  if (zoom === 'fit-width') {
    return widthScale;
  }

  // Resolve the scale at which the page's height fits the viewport,
  // less the padding above and below.
  const heightScale =
    Math.max(viewportHeight - PagePadding * 2, 0) / pageSize.height;

  // Fit the whole page along its tighter axis
  return Math.min(widthScale, heightScale);
}
