import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { cleanup, pdfDocumentPath, setup } from '../test-utils';
import { unloadPdfAnnotations } from './unloadPdfAnnotations';

describe('unloadPdfAnnotations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("removes the document's annotations from the store", () => {
    unloadPdfAnnotations(pdfDocumentPath);

    expect(PdfAnnotationsStore).not.toHaveItem(pdfDocumentPath);
  });
});
