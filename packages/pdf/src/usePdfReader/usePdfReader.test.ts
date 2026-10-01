// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { PdfReadersStore } from '../PdfReadersStore';
import { hasPdfReader } from '../hasPdfReader';
import {
  cleanup,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { usePdfReader } from './usePdfReader';

// The view area the reader renders in
const viewAreaId = 'view-area-1';

describe('usePdfReader', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('registers the reader for as long as it renders', () => {
    const { unmount } = renderHook(() =>
      usePdfReader(pdfDocumentPath, viewAreaId),
    );

    expect(hasPdfReader(pdfDocumentPath, viewAreaId)).toBe(true);

    unmount();

    expect(hasPdfReader(pdfDocumentPath, viewAreaId)).toBe(false);
  });

  it('moves its registration to a new document', () => {
    const { rerender } = renderHook(
      (props: { path: string }) => usePdfReader(props.path, viewAreaId),
      { initialProps: { path: pdfDocumentPath } },
    );

    rerender({ path: pdfDocumentPath_unannotated });

    expect(hasPdfReader(pdfDocumentPath, viewAreaId)).toBe(false);
    expect(hasPdfReader(pdfDocumentPath_unannotated, viewAreaId)).toBe(true);
  });

  it('registers nothing without a view area', () => {
    renderHook(() => usePdfReader(pdfDocumentPath, null));

    expect(PdfReadersStore.getState().readers).toEqual([]);
  });

  it('registers nothing without a document', () => {
    renderHook(() => usePdfReader(null, viewAreaId));

    expect(PdfReadersStore.getState().readers).toEqual([]);
  });
});
