import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationNotFoundError } from '../errors';
import { PdfAnnotationDeletedEvent } from '../events';
import {
  cleanup,
  pdfAnnotation_1,
  pdfAnnotation_2,
  pdfDocumentPath,
  setup,
} from '../test-utils';
import { deletePdfAnnotation } from './deletePdfAnnotation';

describe('deletePdfAnnotation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the annotation from the store', () => {
    deletePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id);

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath, {
      path: pdfDocumentPath,
      annotations: [pdfAnnotation_2],
    });
  });

  it('throws if the annotation does not exist', () => {
    expect(() => deletePdfAnnotation(pdfDocumentPath, 'missing')).toThrow(
      PdfAnnotationNotFoundError,
    );
  });

  it('dispatches the annotation deleted event', () =>
    new Promise<void>((done) => {
      Events.addListener(PdfAnnotationDeletedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          path: pdfDocumentPath,
          annotation: pdfAnnotation_1,
        });
        done();
      });

      deletePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id);
    }));
});
