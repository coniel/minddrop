import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationsLoadedEvent } from '../events';
import {
  cleanup,
  pdfAnnotation_2,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { loadPdfAnnotations } from './loadPdfAnnotations';

describe('loadPdfAnnotations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the annotations into the store', () => {
    loadPdfAnnotations(pdfDocumentPath_unannotated, pdfAnnotations);

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath_unannotated, {
      path: pdfDocumentPath_unannotated,
      annotations: pdfAnnotations,
    });
  });

  it('replaces the annotations the store holds for the document', () => {
    loadPdfAnnotations(pdfDocumentPath, [pdfAnnotation_2]);

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath, {
      path: pdfDocumentPath,
      annotations: [pdfAnnotation_2],
    });
  });

  it('dispatches the annotations loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(PdfAnnotationsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          path: pdfDocumentPath_unannotated,
          annotations: pdfAnnotations,
        });
        done();
      });

      loadPdfAnnotations(pdfDocumentPath_unannotated, pdfAnnotations);
    }));
});
