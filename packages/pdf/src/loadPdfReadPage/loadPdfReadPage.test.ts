import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { PdfReadPageSetEvent } from '../events';
import { cleanup, pdfDocumentPath, setup } from '../test-utils';
import { loadPdfReadPage } from './loadPdfReadPage';

describe('loadPdfReadPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the page into the store', () => {
    loadPdfReadPage(pdfDocumentPath, 2);

    expect(PdfReadPagesStore.get(pdfDocumentPath)?.page).toBe(2);
  });

  it('dispatches no read page set event', async () => {
    // Whether a read page set event was dispatched
    let dispatched = false;

    Events.addListener(PdfReadPageSetEvent, 'test', () => {
      dispatched = true;
    });

    loadPdfReadPage(pdfDocumentPath, 2);

    // Let any listener run
    await Events.tests.awaitAllListeners();

    expect(dispatched).toBe(false);
  });
});
