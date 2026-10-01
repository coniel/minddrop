// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup as cleanupRender, renderHook } from '@minddrop/test-utils';
import {
  cleanup,
  pdfAnnotation_1,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { usePdfAnnotation, usePdfAnnotations } from './PdfAnnotationsStore';

describe('PdfAnnotationsStore', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();

    await cleanup();
  });

  describe('usePdfAnnotations', () => {
    it("returns a document's annotations", () => {
      const { result } = renderHook(() => usePdfAnnotations(pdfDocumentPath));

      expect(result.current).toEqual(pdfAnnotations);
    });

    it('returns the same empty annotations for an unloaded document on every render', () => {
      const { result, rerender } = renderHook(() =>
        usePdfAnnotations(pdfDocumentPath_unannotated),
      );
      const first = result.current;

      rerender();

      expect(first).toEqual([]);
      expect(result.current).toBe(first);
    });
  });

  describe('usePdfAnnotation', () => {
    it('returns the annotation', () => {
      const { result } = renderHook(() =>
        usePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id),
      );

      expect(result.current).toEqual(pdfAnnotation_1);
    });

    it('returns null for an annotation which does not exist', () => {
      const { result } = renderHook(() =>
        usePdfAnnotation(pdfDocumentPath, 'missing'),
      );

      expect(result.current).toBeNull();
    });
  });
});
