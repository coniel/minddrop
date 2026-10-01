import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PdfAnnotationNotFoundError } from '../errors';
import {
  cleanup,
  pdfAnnotation_1,
  pdfDocumentPath,
  setup,
} from '../test-utils';
import { getPdfAnnotation } from './getPdfAnnotation';

describe('getPdfAnnotation', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the annotation', () => {
    expect(getPdfAnnotation(pdfDocumentPath, pdfAnnotation_1.id)).toEqual(
      pdfAnnotation_1,
    );
  });

  it('throws if the annotation does not exist', () => {
    expect(() => getPdfAnnotation(pdfDocumentPath, 'missing')).toThrow(
      PdfAnnotationNotFoundError,
    );
  });

  it('returns null if the annotation does not exist and throwing is disabled', () => {
    expect(getPdfAnnotation(pdfDocumentPath, 'missing', false)).toBeNull();
  });
});
