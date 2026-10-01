import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import {
  cleanup,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { movePdfAnnotations } from './movePdfAnnotations';

describe('movePdfAnnotations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('re-keys the annotations under the new path', () => {
    movePdfAnnotations(pdfDocumentPath, pdfDocumentPath_unannotated);

    expect(PdfAnnotationsStore).not.toHaveItem(pdfDocumentPath);
    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath_unannotated, {
      path: pdfDocumentPath_unannotated,
      annotations: pdfAnnotations,
    });
  });

  it('does nothing for a document without loaded annotations', () => {
    movePdfAnnotations(pdfDocumentPath_unannotated, '/elsewhere.pdf');

    expect(PdfAnnotationsStore).not.toHaveItem('/elsewhere.pdf');
  });
});
