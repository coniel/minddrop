import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadPdfReadPage } from '../loadPdfReadPage';
import { cleanup, pdfDocumentPath, setup } from '../test-utils';
import { getPdfReadPage } from './getPdfReadPage';

describe('getPdfReadPage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the page last read', () => {
    loadPdfReadPage(pdfDocumentPath, 3);

    expect(getPdfReadPage(pdfDocumentPath)).toBe(3);
  });

  it('returns null when no page is recorded', () => {
    expect(getPdfReadPage(pdfDocumentPath)).toBeNull();
  });
});
