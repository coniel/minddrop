import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
  setup,
} from '../test-utils';
import { getPdfAnnotations } from './getPdfAnnotations';

describe('getPdfAnnotations', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns the document's annotations", () => {
    expect(getPdfAnnotations(pdfDocumentPath)).toEqual(pdfAnnotations);
  });

  it('returns no annotations for a document without loaded ones', () => {
    expect(getPdfAnnotations(pdfDocumentPath_unannotated)).toEqual([]);
  });
});
