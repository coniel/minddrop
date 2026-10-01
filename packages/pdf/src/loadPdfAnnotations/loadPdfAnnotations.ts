import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationsLoadedEvent } from '../events';
import { PdfAnnotation } from '../types';

/**
 * Loads a document's annotations into the store, replacing any it
 * holds for the document.
 *
 * @param path - The absolute path of the PDF file.
 * @param annotations - The document's annotations.
 *
 * @dispatches pdf-annotations:loaded
 */
export function loadPdfAnnotations(
  path: string,
  annotations: PdfAnnotation[],
): void {
  // Load the annotations into the store
  PdfAnnotationsStore.set({ path, annotations });

  // Dispatch annotations loaded event
  Events.dispatch(PdfAnnotationsLoadedEvent, { path, annotations });
}
