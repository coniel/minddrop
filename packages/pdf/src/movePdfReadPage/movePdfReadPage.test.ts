import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { loadPdfReadPage } from '../loadPdfReadPage';
import {
  cleanup,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { movePdfReadPage } from './movePdfReadPage';

describe('movePdfReadPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('re-keys the page under the new path', () => {
    loadPdfReadPage(pdfDocumentPath, 5);

    movePdfReadPage(pdfDocumentPath, pdfDocumentPath_unannotated);

    expect(PdfReadPagesStore).not.toHaveItem(pdfDocumentPath);
    expect(PdfReadPagesStore.get(pdfDocumentPath_unannotated)).toEqual({
      path: pdfDocumentPath_unannotated,
      page: 5,
    });
  });

  it('does nothing when no page is recorded', () => {
    movePdfReadPage(pdfDocumentPath, pdfDocumentPath_unannotated);

    expect(PdfReadPagesStore).not.toHaveItem(pdfDocumentPath_unannotated);
  });
});
