import { DefaultPdfZoom } from './constants';
import { PdfReadPageSetEvent } from './events';

// Const-asserted so the names keep their literal types. The event
// data registry is keyed by them.
export const events = {
  ReadPageSet: PdfReadPageSetEvent,
} as const;

export const constants = {
  DefaultZoom: DefaultPdfZoom,
};

export { getPdfReadPage as getReadPage } from './getPdfReadPage';
export { setPdfReadPage as setReadPage } from './setPdfReadPage';
export { loadPdfReadPage as loadReadPage } from './loadPdfReadPage';
export { unloadPdfReadPage as unloadReadPage } from './unloadPdfReadPage';
export { movePdfReadPage as moveReadPage } from './movePdfReadPage';
export {
  PdfReadPagesStore as ReadPagesStore,
  usePdfReadPage as useReadPage,
} from './PdfReadPagesStore';
export { requestPdfAnnotationFocus as requestAnnotationFocus } from './requestPdfAnnotationFocus';
export { usePdfAnnotationFocusRequest as useAnnotationFocusRequest } from './PdfAnnotationFocusRequestStore';
export { usePdfReader as useReader } from './usePdfReader';
export { hasPdfReader as hasReader } from './hasPdfReader';
