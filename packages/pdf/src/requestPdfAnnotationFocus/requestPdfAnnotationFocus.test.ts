// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { usePdfAnnotationFocusRequest } from '../PdfAnnotationFocusRequestStore';
import { AnnotationFocusRequestTimeoutMs } from '../constants';
import {
  cleanup,
  pdfAnnotation_1,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { requestPdfAnnotationFocus } from './requestPdfAnnotationFocus';

describe('requestPdfAnnotationFocus', () => {
  beforeEach(() => {
    setup();
    vi.useFakeTimers();
  });

  afterEach(cleanup);

  it("reaches the document's readers with the annotation", () => {
    const { result } = renderHook(() =>
      usePdfAnnotationFocusRequest(pdfDocumentPath),
    );

    act(() => {
      requestPdfAnnotationFocus(pdfDocumentPath, pdfAnnotation_1.id);
    });

    expect(result.current).toEqual({
      path: pdfDocumentPath,
      annotationId: pdfAnnotation_1.id,
    });
  });

  it("does not reach another document's readers", () => {
    const { result } = renderHook(() =>
      usePdfAnnotationFocusRequest(pdfDocumentPath_unannotated),
    );

    act(() => {
      requestPdfAnnotationFocus(pdfDocumentPath, pdfAnnotation_1.id);
    });

    expect(result.current).toBeNull();
  });

  it('reaches the readers anew when a request is repeated', () => {
    const { result } = renderHook(() =>
      usePdfAnnotationFocusRequest(pdfDocumentPath),
    );

    act(() => {
      requestPdfAnnotationFocus(pdfDocumentPath, pdfAnnotation_1.id);
    });

    // The request the readers received first
    const first = result.current;

    act(() => {
      requestPdfAnnotationFocus(pdfDocumentPath, pdfAnnotation_1.id);
    });

    expect(result.current).not.toBe(first);
  });

  it('clears the request once it expires', () => {
    const { result } = renderHook(() =>
      usePdfAnnotationFocusRequest(pdfDocumentPath),
    );

    act(() => {
      requestPdfAnnotationFocus(pdfDocumentPath, pdfAnnotation_1.id);
    });
    act(() => {
      vi.advanceTimersByTime(AnnotationFocusRequestTimeoutMs);
    });

    expect(result.current).toBeNull();
  });
});
