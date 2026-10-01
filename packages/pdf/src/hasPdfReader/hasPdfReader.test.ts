import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerPdfReader } from '../registerPdfReader';
import {
  cleanup,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { hasPdfReader } from './hasPdfReader';

// The view area the reader renders in
const viewAreaId = 'view-area-1';

describe('hasPdfReader', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('finds a reader of the document in the view area', () => {
    registerPdfReader({ path: pdfDocumentPath, viewAreaId });

    expect(hasPdfReader(pdfDocumentPath, viewAreaId)).toBe(true);
  });

  it('ignores readers in other view areas', () => {
    registerPdfReader({ path: pdfDocumentPath, viewAreaId });

    expect(hasPdfReader(pdfDocumentPath, 'view-area-2')).toBe(false);
  });

  it('ignores readers of other documents', () => {
    registerPdfReader({ path: pdfDocumentPath, viewAreaId });

    expect(hasPdfReader(pdfDocumentPath_unannotated, viewAreaId)).toBe(false);
  });

  it('keeps the other readers when one is removed', () => {
    // Register a reader of each document, then remove the first
    const remove = registerPdfReader({ path: pdfDocumentPath, viewAreaId });

    registerPdfReader({ path: pdfDocumentPath_unannotated, viewAreaId });
    remove();

    expect(hasPdfReader(pdfDocumentPath, viewAreaId)).toBe(false);
    expect(hasPdfReader(pdfDocumentPath_unannotated, viewAreaId)).toBe(true);
  });
});
