import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveAnchorFragment } from '@minddrop/ast';
import { DatabaseEntries } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { InsertEditorReferenceEvent } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { quoteEntryPdfAnnotation } from './quoteEntryPdfAnnotation';

const { databaseEntry_pdf_1, databaseEntry_pdf_1PropertyFilePath } =
  DatabaseFixtures;
const { pdfAnnotation_1 } = PdfAnnotationFixtures;

// The path of the pdf entry's document
const path = databaseEntry_pdf_1PropertyFilePath;

describe('quoteEntryPdfAnnotation', () => {
  // The references inserted
  let inserted: unknown[];

  beforeEach(() => {
    setup();
    setupPdfFixtures();
    inserted = [];
    Events.addListener(InsertEditorReferenceEvent, 'test', (data) => {
      inserted.push(data);
    });
  });

  afterEach(cleanup);

  it('quotes nothing for a request made outside a view pane', async () => {
    quoteEntryPdfAnnotation({ path, annotation: pdfAnnotation_1 });

    // Let any listener run
    await Events.tests.awaitAllListeners();

    expect(inserted).toEqual([]);
  });

  it('quotes nothing for a document no entry property holds', async () => {
    quoteEntryPdfAnnotation({
      path: '/elsewhere/paper.pdf',
      annotation: pdfAnnotation_1,
      viewAreaId: 'view-area',
      sourcePane: 'main',
    });

    // Let any listener run
    await Events.tests.awaitAllListeners();

    expect(inserted).toEqual([]);
  });

  it("quotes the annotation into the pane it was sent from, linking to the entry's annotation", async () => {
    quoteEntryPdfAnnotation({
      path,
      annotation: pdfAnnotation_1,
      viewAreaId: 'view-area',
      sourcePane: 'split',
    });

    // Let the listener run
    await Events.tests.awaitAllListeners();

    expect(inserted).toEqual([
      {
        viewAreaId: 'view-area',
        pane: 'split',
        reference: DatabaseEntries.resolveReference(databaseEntry_pdf_1.id),
        fragment: resolveAnchorFragment(pdfAnnotation_1.id),
        label: pdfAnnotation_1.text,
        quote: true,
      },
    ]);
  });
});
