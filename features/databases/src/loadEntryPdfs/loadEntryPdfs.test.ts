import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { loadEntryPdfs } from './loadEntryPdfs';

const {
  databaseEntry_pdf_1,
  databaseEntry_pdf_1PropertyFilePath,
  rootStorageEntry1,
  pdfPropertyName,
} = DatabaseFixtures;
const { pdfAnnotations } = PdfAnnotationFixtures;

// The path of the pdf entry's document
const path = databaseEntry_pdf_1PropertyFilePath;

describe('loadEntryPdfs', () => {
  beforeEach(() => {
    setup();
    setupPdfFixtures();
  });

  afterEach(cleanup);

  it("loads the pdf property's annotations under its file path", () => {
    // The entry keeps annotations for its pdf property
    DatabaseEntries.Store.update(databaseEntry_pdf_1.id, {
      metadata: {
        properties: { [pdfPropertyName]: { annotations: pdfAnnotations } },
      },
    });

    loadEntryPdfs(databaseEntry_pdf_1);

    expect(PdfAnnotations.Store).toHaveItem(path, {
      path,
      annotations: pdfAnnotations,
    });
  });

  it("loads the pdf property's page last read under its file path", () => {
    // Record a page last read for the entry's pdf property
    DatabaseEntries.Store.update(databaseEntry_pdf_1.id, {
      metadata: { properties: { [pdfPropertyName]: { page: 4 } } },
    });

    loadEntryPdfs(databaseEntry_pdf_1);

    expect(Pdf.getReadPage(path)).toBe(4);
  });

  it('loads an empty document for a property without annotations', () => {
    loadEntryPdfs(databaseEntry_pdf_1);

    expect(PdfAnnotations.Store).toHaveItem(path, { path, annotations: [] });
  });

  it('loads nothing for an entry without pdf properties', () => {
    loadEntryPdfs(rootStorageEntry1);

    expect(PdfAnnotations.Store).toHaveItemCount(0);
  });
});
