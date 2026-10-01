import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { persistEntryPdfAnnotations } from './persistEntryPdfAnnotations';

const {
  databaseEntry_pdf_1,
  databaseEntry_pdf_1PropertyFilePath,
  pdfPropertyName,
} = DatabaseFixtures;
const { pdfAnnotations } = PdfAnnotationFixtures;

// The path of the pdf entry's document
const path = databaseEntry_pdf_1PropertyFilePath;

describe('persistEntryPdfAnnotations', () => {
  beforeEach(() => {
    setup();
    setupPdfFixtures();
  });

  afterEach(cleanup);

  it("writes the annotations to the entry property's metadata", async () => {
    PdfAnnotations.load(path, pdfAnnotations);

    await persistEntryPdfAnnotations(path);

    expect(
      storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
        .properties?.[pdfPropertyName],
    ).toEqual({ annotations: pdfAnnotations });
  });

  it('does nothing for a document no entry property holds', async () => {
    PdfAnnotations.load('/elsewhere/paper.pdf', pdfAnnotations);

    await persistEntryPdfAnnotations('/elsewhere/paper.pdf');

    expect(
      storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
        .properties?.[pdfPropertyName],
    ).toBeUndefined();
  });
});
