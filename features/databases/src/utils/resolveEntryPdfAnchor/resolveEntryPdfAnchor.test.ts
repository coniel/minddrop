import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveAnchorFragment } from '@minddrop/ast';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../../test-utils';
import { resolveEntryPdfAnchor } from './resolveEntryPdfAnchor';

const { entry_pdf_1, entry_pdf_1PropertyFilePath, rootStorageEntry1 } =
  DatabaseFixtures;
const { pdfAnnotation_1, pdfAnnotations } = PdfAnnotationFixtures;

// The path of the pdf entry's document
const path = entry_pdf_1PropertyFilePath;

describe('resolveEntryPdfAnchor', () => {
  beforeEach(() => {
    setup();
    setupPdfFixtures();
    PdfAnnotations.load(path, pdfAnnotations);
  });

  afterEach(cleanup);

  it("resolves an anchor naming an annotation of the entry's pdf", () => {
    expect(
      resolveEntryPdfAnchor(
        entry_pdf_1,
        resolveAnchorFragment(pdfAnnotation_1.id),
      ),
    ).toEqual({ path, annotationId: pdfAnnotation_1.id });
  });

  it('resolves no anchor naming an annotation the entry lacks', () => {
    expect(
      resolveEntryPdfAnchor(entry_pdf_1, resolveAnchorFragment('missing')),
    ).toBeNull();
  });

  it('resolves no anchor for an entry without pdf properties', () => {
    expect(
      resolveEntryPdfAnchor(
        rootStorageEntry1,
        resolveAnchorFragment(pdfAnnotation_1.id),
      ),
    ).toBeNull();
  });

  it('resolves no fragment which is not an anchor', () => {
    expect(resolveEntryPdfAnchor(entry_pdf_1, 'Heading')).toBeNull();
  });
});
