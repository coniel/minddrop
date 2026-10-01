import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { persistEntryPdfReadPage } from './persistEntryPdfReadPage';

const {
  databaseEntry_pdf_1,
  databaseEntry_pdf_1PropertyFilePath,
  pdfPropertyName,
} = DatabaseFixtures;

// The path of the pdf entry's document
const path = databaseEntry_pdf_1PropertyFilePath;

describe('persistEntryPdfReadPage', () => {
  beforeEach(() => {
    setup();
    setupPdfFixtures();
  });

  afterEach(cleanup);

  it("writes the page to the entry property's metadata", async () => {
    await persistEntryPdfReadPage(path, 5);

    expect(
      storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
        .properties?.[pdfPropertyName],
    ).toEqual({ page: 5 });
  });

  it('writes nothing when the page is the one recorded', async () => {
    // Record the page, keeping the metadata it is recorded in
    DatabaseEntries.Store.update(databaseEntry_pdf_1.id, {
      metadata: { properties: { [pdfPropertyName]: { page: 5 } } },
    });

    const recorded = storeItem(
      DatabaseEntries.Store,
      databaseEntry_pdf_1.id,
    ).metadata;

    await persistEntryPdfReadPage(path, 5);

    expect(
      storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata,
    ).toBe(recorded);
  });

  it('does nothing for a document no entry property holds', async () => {
    await persistEntryPdfReadPage('/elsewhere/paper.pdf', 5);

    expect(
      storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
        .properties?.[pdfPropertyName],
    ).toBeUndefined();
  });
});
