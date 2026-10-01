import { ContentColors } from '@minddrop/ui-theme';
import { PdfAnnotationColor, PdfZoom } from './types';

// The default PDF zoom
export const DefaultPdfZoom: PdfZoom = 'fit-width';

// The number of characters in an annotation ID
export const AnnotationIdLength = 8;

// The highlight colours: every content colour but the default
export const PdfAnnotationColors: PdfAnnotationColor[] = ContentColors.filter(
  (color) => color !== 'default',
);

// The default highlight colour
export const DefaultPdfAnnotationColor: PdfAnnotationColor = 'yellow';

// How long an annotation focus request stays pending, in milliseconds
export const AnnotationFocusRequestTimeoutMs = 500;
