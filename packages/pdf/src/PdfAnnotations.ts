import {
  AnnotationIdLength,
  DefaultPdfAnnotationColor,
  PdfAnnotationColors,
} from './constants';
import { PdfAnnotationNotFoundError } from './errors';
import {
  PdfAnnotationCreatedEvent,
  PdfAnnotationDeletedEvent,
  PdfAnnotationQuoteRequestedEvent,
  PdfAnnotationUpdatedEvent,
  PdfAnnotationsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types. The event
// data registry is keyed by them.
export const events = {
  Created: PdfAnnotationCreatedEvent,
  Updated: PdfAnnotationUpdatedEvent,
  Deleted: PdfAnnotationDeletedEvent,
  Loaded: PdfAnnotationsLoadedEvent,
  QuoteRequested: PdfAnnotationQuoteRequestedEvent,
} as const;

export const errors = {
  NotFound: PdfAnnotationNotFoundError,
};

export const constants = {
  Colors: PdfAnnotationColors,
  DefaultColor: DefaultPdfAnnotationColor,
  IdLength: AnnotationIdLength,
};

export { createPdfAnnotation as create } from './createPdfAnnotation';
export { updatePdfAnnotation as update } from './updatePdfAnnotation';
export { deletePdfAnnotation as delete } from './deletePdfAnnotation';
export { getPdfAnnotation as get } from './getPdfAnnotation';
export { getPdfAnnotations as getAll } from './getPdfAnnotations';
export { loadPdfAnnotations as load } from './loadPdfAnnotations';
export { unloadPdfAnnotations as unload } from './unloadPdfAnnotations';
export { movePdfAnnotations as move } from './movePdfAnnotations';
export {
  PdfAnnotationsStore as Store,
  usePdfAnnotation as use,
  usePdfAnnotations as useAll,
} from './PdfAnnotationsStore';
