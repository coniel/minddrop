import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { moveEntryPdfs } from './moveEntryPdfs';

const {
  database_pdf,
  databaseEntry_pdf_1,
  databaseEntry_pdf_1PropertyFilePath,
  pdfPropertyName,
  validPdfPropertyFile,
} = DatabaseFixtures;
const { pdfAnnotations } = PdfAnnotationFixtures;

// The entry renamed
const original = databaseEntry_pdf_1;
const updated = { ...original, title: 'Renamed', path: 'Renamed/Renamed.md' };

describe('moveEntryPdfs', () => {
  beforeEach(() => {
    setup();
    setupPdfFixtures();
  });

  afterEach(cleanup);

  it("re-keys the annotations under the file's new path when the file moves", () => {
    // Switch the database to entry storage, under which the file moves
    // with the entry's title.
    Databases.Store.update(database_pdf.id, { propertyFileStorage: 'entry' });

    // The file's path before and after
    const fromPath = DatabaseEntries.propertyFilePath(
      original,
      pdfPropertyName,
      validPdfPropertyFile.name,
    );
    const toPath = DatabaseEntries.propertyFilePath(
      updated,
      pdfPropertyName,
      validPdfPropertyFile.name,
    );

    PdfAnnotations.load(fromPath, pdfAnnotations);
    Pdf.loadReadPage(fromPath, 3);

    moveEntryPdfs(original, updated);

    expect(PdfAnnotations.Store).not.toHaveItem(fromPath);
    expect(PdfAnnotations.Store).toHaveItem(toPath, {
      path: toPath,
      annotations: pdfAnnotations,
    });
    expect(Pdf.getReadPage(fromPath)).toBeNull();
    expect(Pdf.getReadPage(toPath)).toBe(3);
  });

  it('leaves the annotations in place when the file stays put', () => {
    // Load the annotations under the file's path. Under the fixture
    // database's property directory storage it does not depend on the
    // entry's title.
    PdfAnnotations.load(databaseEntry_pdf_1PropertyFilePath, pdfAnnotations);

    moveEntryPdfs(original, updated);

    expect(PdfAnnotations.Store).toHaveItem(
      databaseEntry_pdf_1PropertyFilePath,
      {
        path: databaseEntry_pdf_1PropertyFilePath,
        annotations: pdfAnnotations,
      },
    );
  });
});
