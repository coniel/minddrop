import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { loadPdfReadPage } from '../loadPdfReadPage';
import { cleanup, pdfDocumentPath, setup } from '../test-utils';
import { unloadPdfReadPage } from './unloadPdfReadPage';

describe('unloadPdfReadPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the page from the store', () => {
    loadPdfReadPage(pdfDocumentPath, 2);

    unloadPdfReadPage(pdfDocumentPath);

    expect(PdfReadPagesStore).not.toHaveItem(pdfDocumentPath);
  });
});
