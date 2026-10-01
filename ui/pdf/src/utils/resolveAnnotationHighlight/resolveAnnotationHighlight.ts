import { PdfAnnotation } from '@minddrop/pdf';
import { PdfHighlight } from '../../types';

/**
 * Resolves an annotation to the highlight drawn for it.
 *
 * @param annotation - The annotation.
 * @returns The highlight.
 */
export function resolveAnnotationHighlight(
  annotation: PdfAnnotation,
): PdfHighlight {
  // Pick the fields the highlight is drawn from
  return {
    id: annotation.id,
    page: annotation.page,
    rects: annotation.rects,
    color: annotation.color,
  };
}
