import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PdfReadPagesStore } from '../PdfReadPagesStore';
import { PdfReadPageSetEvent, PdfReadPageSetEventData } from '../events';
import { cleanup, pdfDocumentPath, setup } from '../test-utils';
import { setPdfReadPage } from './setPdfReadPage';

describe('setPdfReadPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records the page in the store', () => {
    setPdfReadPage(pdfDocumentPath, 4);

    expect(PdfReadPagesStore.get(pdfDocumentPath)).toEqual({
      path: pdfDocumentPath,
      page: 4,
    });
  });

  it('dispatches a read page set event', async () => {
    // The dispatched event's data
    let dispatched: PdfReadPageSetEventData | null = null;

    Events.addListener(PdfReadPageSetEvent, 'test', (data) => {
      dispatched = data;
    });

    setPdfReadPage(pdfDocumentPath, 4);

    // Let the listener run
    await Events.tests.awaitAllListeners();

    expect(dispatched).toEqual({ path: pdfDocumentPath, page: 4 });
  });
});
