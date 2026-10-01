import { Events } from '@minddrop/events';
import { uniqueShortId } from '@minddrop/utils';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { AnnotationIdLength } from '../constants';
import { PdfAnnotationCreatedEvent } from '../events';
import { getPdfAnnotations } from '../getPdfAnnotations';
import { PdfAnnotation } from '../types';

export type CreatePdfAnnotationData = Omit<PdfAnnotation, 'id' | 'created'>;

/**
 * Creates an annotation on a document, adding it to the store.
 *
 * @param path - The absolute path of the PDF file.
 * @param data - The annotation data.
 * @returns The created annotation.
 *
 * @dispatches pdf-annotations:annotation:created
 */
export function createPdfAnnotation(
  path: string,
  data: CreatePdfAnnotationData,
): PdfAnnotation {
  // Get the document's annotations
  const annotations = getPdfAnnotations(path);

  // Build the annotation with an ID no existing annotation uses
  const annotation: PdfAnnotation = {
    ...data,
    id: uniqueShortId(
      annotations.map((annotation) => annotation.id),
      AnnotationIdLength,
    ),
    created: new Date(),
  };

  // Add the annotation to the document's stored annotations
  PdfAnnotationsStore.set({ path, annotations: [...annotations, annotation] });

  // Dispatch annotation created event
  Events.dispatch(PdfAnnotationCreatedEvent, { path, annotation });

  return annotation;
}
