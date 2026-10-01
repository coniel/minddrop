import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationUpdatedEvent } from '../events';
import { getPdfAnnotation } from '../getPdfAnnotation';
import { getPdfAnnotations } from '../getPdfAnnotations';
import { PdfAnnotation } from '../types';

export type UpdatePdfAnnotationData = Partial<
  Pick<PdfAnnotation, 'color' | 'note'>
>;

/**
 * Applies changes to an annotation, updating the store.
 *
 * @param path - The absolute path of the PDF file.
 * @param id - The ID of the annotation.
 * @param data - The changes to apply.
 * @returns The updated annotation.
 *
 * @throws {PdfAnnotationNotFoundError} If the annotation does not exist.
 *
 * @dispatches pdf-annotations:annotation:updated
 */
export function updatePdfAnnotation(
  path: string,
  id: string,
  data: UpdatePdfAnnotationData,
): PdfAnnotation {
  // Get the annotation, throwing if it does not exist
  const original = getPdfAnnotation(path, id);

  // Apply the changes
  const updated: PdfAnnotation = { ...original, ...data };

  // Replace the annotation in the document's stored annotations
  PdfAnnotationsStore.update(path, {
    annotations: getPdfAnnotations(path).map((annotation) =>
      annotation.id === id ? updated : annotation,
    ),
  });

  // Dispatch annotation updated event
  Events.dispatch(PdfAnnotationUpdatedEvent, { path, original, updated });

  return updated;
}
