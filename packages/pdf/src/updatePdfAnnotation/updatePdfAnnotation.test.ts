import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { PdfAnnotationNotFoundError } from '../errors';
import { PdfAnnotationUpdatedEvent } from '../events';
import {
  cleanup,
  pdfAnnotation_1,
  pdfAnnotation_2,
  pdfDocumentPath,
  setup,
} from '../test-utils';
import { updatePdfAnnotation } from './updatePdfAnnotation';

const updated = { ...pdfAnnotation_1, color: 'blue' as const };

describe('updatePdfAnnotation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the updated annotation', () => {
    expect(
      updatePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id, {
        color: 'blue',
      }),
    ).toEqual(updated);
  });

  it('replaces the annotation in the store, in place', () => {
    updatePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id, {
      color: 'blue',
    });

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath, {
      path: pdfDocumentPath,
      annotations: [updated, pdfAnnotation_2],
    });
  });

  it('throws if the annotation does not exist', () => {
    expect(() =>
      updatePdfAnnotation(pdfDocumentPath, 'missing', { color: 'blue' }),
    ).toThrow(PdfAnnotationNotFoundError);
  });

  it('dispatches the annotation updated event', () =>
    new Promise<void>((done) => {
      Events.addListener(PdfAnnotationUpdatedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          path: pdfDocumentPath,
          original: pdfAnnotation_1,
          updated,
        });
        done();
      });

      updatePdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id, {
        color: 'blue',
      });
    }));
});
