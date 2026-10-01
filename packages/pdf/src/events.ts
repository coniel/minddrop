import { PdfAnnotation } from './types';

export const PdfAnnotationCreatedEvent = 'pdf-annotations:annotation:created';
export const PdfAnnotationUpdatedEvent = 'pdf-annotations:annotation:updated';
export const PdfAnnotationDeletedEvent = 'pdf-annotations:annotation:deleted';
export const PdfAnnotationsLoadedEvent = 'pdf-annotations:loaded';
export const PdfAnnotationQuoteRequestedEvent =
  'pdf-annotations:annotation:quote-requested';
export const PdfReadPageSetEvent = 'pdf:read-page:set';

export interface PdfAnnotationCreatedEventData {
  /**
   * The absolute path of the PDF file the annotation belongs to.
   */
  path: string;

  /**
   * The created annotation.
   */
  annotation: PdfAnnotation;
}

export interface PdfAnnotationUpdatedEventData {
  /**
   * The absolute path of the PDF file the annotation belongs to.
   */
  path: string;

  /**
   * The annotation from before the update.
   */
  original: PdfAnnotation;

  /**
   * The updated annotation.
   */
  updated: PdfAnnotation;
}

export interface PdfAnnotationDeletedEventData {
  /**
   * The absolute path of the PDF file the annotation belonged to.
   */
  path: string;

  /**
   * The deleted annotation.
   */
  annotation: PdfAnnotation;
}

export interface PdfAnnotationsLoadedEventData {
  /**
   * The absolute path of the PDF file the annotations belong to.
   */
  path: string;

  /**
   * The loaded annotations.
   */
  annotations: PdfAnnotation[];
}

export interface PdfAnnotationQuoteRequestedEventData {
  /**
   * The absolute path of the PDF file the annotation belongs to.
   */
  path: string;

  /**
   * The annotation to quote.
   */
  annotation: PdfAnnotation;

  /**
   * The ID of the view area the request was made from. Unset when it
   * was made from outside one.
   */
  viewAreaId?: string;

  /**
   * The pane of that view area the request was made from.
   */
  sourcePane?: 'main' | 'split';
}

export interface PdfReadPageSetEventData {
  /**
   * The absolute path of the PDF file.
   */
  path: string;

  /**
   * The page last read, 1-based.
   */
  page: number;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'pdf-annotations:annotation:created': PdfAnnotationCreatedEventData;
    'pdf-annotations:annotation:updated': PdfAnnotationUpdatedEventData;
    'pdf-annotations:annotation:deleted': PdfAnnotationDeletedEventData;
    'pdf-annotations:loaded': PdfAnnotationsLoadedEventData;
    'pdf-annotations:annotation:quote-requested': PdfAnnotationQuoteRequestedEventData;
    'pdf:read-page:set': PdfReadPageSetEventData;
  }
}
