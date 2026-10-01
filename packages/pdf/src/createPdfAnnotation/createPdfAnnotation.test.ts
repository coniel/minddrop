import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfAnnotationsStore } from '../PdfAnnotationsStore';
import { AnnotationIdLength } from '../constants';
import { PdfAnnotationCreatedEvent } from '../events';
import {
  cleanup,
  mockDate,
  pdfAnnotation_2,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { createPdfAnnotation } from './createPdfAnnotation';

// The annotation data, taken from a fixture minus what creation adds
const { id: _id, created: _created, ...data } = pdfAnnotation_2;

// The annotation as creation returns it
const newAnnotation = {
  ...data,
  id: expect.stringMatching(new RegExp(`^[a-z0-9]{${AnnotationIdLength}}$`)),
  created: mockDate,
};

describe('createPdfAnnotation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the annotation', () => {
    expect(createPdfAnnotation(pdfDocumentPath, data)).toEqual(newAnnotation);
  });

  it('gives each annotation an ID of its own', () => {
    const first = createPdfAnnotation(pdfDocumentPath, data);
    const second = createPdfAnnotation(pdfDocumentPath, data);

    expect(first.id).not.toBe(second.id);
  });

  it("appends the annotation to the document's annotations in the store", () => {
    const annotation = createPdfAnnotation(pdfDocumentPath, data);

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath, {
      path: pdfDocumentPath,
      annotations: [...pdfAnnotations, annotation],
    });
  });

  it('starts the annotations of a document which has none', () => {
    const annotation = createPdfAnnotation(pdfDocumentPath_unannotated, data);

    expect(PdfAnnotationsStore).toHaveItem(pdfDocumentPath_unannotated, {
      path: pdfDocumentPath_unannotated,
      annotations: [annotation],
    });
  });

  it('dispatches the annotation created event', () =>
    new Promise<void>((done) => {
      Events.addListener(PdfAnnotationCreatedEvent, 'test', (payload) => {
        expect(payload).toEqual({
          path: pdfDocumentPath,
          annotation: newAnnotation,
        });
        done();
      });

      createPdfAnnotation(pdfDocumentPath, data);
    }));
});
