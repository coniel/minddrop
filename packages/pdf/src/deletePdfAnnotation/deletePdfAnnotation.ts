import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationDeletedEvent } from '../events';
import { getPdfAnnotation } from '../getPdfAnnotation';
import { getPdfAnnotations } from '../getPdfAnnotations';

/**
 * Deletes an annotation, removing it from the store.
 *
 * @param path - The absolute path of the PDF file.
 * @param id - The ID of the annotation.
 *
 * @throws {PdfAnnotationNotFoundError} If the annotation does not exist.
 *
 * @dispatches pdf-annotations:annotation:deleted
 */
export function deletePdfAnnotation(path: string, id: string): void {
  // Get the annotation, throwing if it does not exist
  const annotation = getPdfAnnotation(path, id);

  // Remove the annotation from the document's stored annotations
  PdfAnnotationsStore.update(path, {
    annotations: getPdfAnnotations(path).filter(
      (candidate) => candidate.id !== id,
    ),
  });

  // Dispatch annotation deleted event
  Events.dispatch(PdfAnnotationDeletedEvent, { path, annotation });
}
