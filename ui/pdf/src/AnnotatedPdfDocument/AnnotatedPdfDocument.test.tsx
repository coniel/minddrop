import React, { useEffect, useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { act, render, screen, waitFor } from '@minddrop/test-utils';
import type { PdfDocumentHandle, PdfDocumentProps } from '../PdfDocument';
import { PdfFixtures, cleanup, setup } from '../test-utils';
import { AnnotatedPdfDocument } from './AnnotatedPdfDocument';

const {
  pdfAnnotation_1,
  pdfAnnotation_2,
  pdfAnnotations,
  pdfDocumentPath,
  pdfDocumentPath_unannotated,
} = PdfAnnotationFixtures;
const { pdfTextSelection_1 } = PdfFixtures;

// The passage the stand-in document reports as selected
const selectedText = 'Selected text';

// The IDs of the highlights the stand-in document was scrolled to.
// Recorded through the handle. This pins the handle contract the
// component relies on.
const scrolledTo: string[] = [];

// Stand the reader in with a probe of the highlights it is given, a
// button standing for a colour pick on a selection, and a handle
// recording what it is scrolled to. The reader renders through
// pdf.js, which has no canvas here.
vi.mock('../PdfDocument', () => ({
  PdfDocument: React.forwardRef<PdfDocumentHandle, PdfDocumentProps>(
    function PdfDocumentStandIn(
      {
        src,
        highlights = [],
        selectedHighlightId,
        onDocumentLoad,
        onHighlight,
      },
      ref,
    ) {
      useImperativeHandle(ref, () => ({
        scrollToPage: () => {},
        scrollToHighlight: (highlight) => {
          scrolledTo.push(highlight.id);
        },
      }));

      // Report the document as loaded as soon as it is shown
      useEffect(() => {
        onDocumentLoad?.({ pageCount: 5 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <div data-testid="pdf-document" data-src={src}>
          <div data-testid="highlights">
            {highlights.map((highlight) => highlight.id).join(',')}
          </div>
          <div data-testid="selected">{selectedHighlightId ?? ''}</div>
          <button
            type="button"
            onClick={() =>
              onHighlight?.(
                { ...pdfTextSelection_1, text: selectedText },
                'green',
              )
            }
          >
            highlight
          </button>
        </div>
      );
    },
  ),
}));

/**
 * Renders the document, asking it to bring an annotation forward.
 *
 * @param annotationId - The ID of the annotation to bring forward.
 * @returns The render result.
 */
function renderDocument(annotationId?: string) {
  return render(
    <AnnotatedPdfDocument
      path={pdfDocumentPath}
      focusRequest={
        annotationId ? { path: pdfDocumentPath, annotationId } : null
      }
    />,
  );
}

describe('<AnnotatedPdfDocument />', () => {
  beforeEach(() => {
    setup();
    PdfAnnotations.load(pdfDocumentPath, pdfAnnotations);
    scrolledTo.length = 0;
  });

  afterEach(cleanup);

  it('renders the file at its path', () => {
    renderDocument();

    expect(screen.getByTestId('pdf-document').dataset.src).toContain(
      encodeURIComponent(pdfDocumentPath),
    );
  });

  it("draws the document's annotations as highlights", () => {
    renderDocument();

    expect(screen.getByTestId('highlights').textContent).toBe(
      `${pdfAnnotation_1.id},${pdfAnnotation_2.id}`,
    );
  });

  it('draws no highlights for a document without annotations', () => {
    render(<AnnotatedPdfDocument path={pdfDocumentPath_unannotated} />);

    expect(screen.getByTestId('highlights').textContent).toBe('');
  });

  it('creates an annotation from a highlighted selection', async () => {
    renderDocument();

    await act(async () => {
      screen.getByText('highlight').click();
    });

    expect(
      storeItem(PdfAnnotations.Store, pdfDocumentPath).annotations,
    ).toContainEqual(
      expect.objectContaining({ text: selectedText, color: 'green' }),
    );
  });

  it('brings the requested annotation forward', async () => {
    renderDocument(pdfAnnotation_2.id);

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_2.id]);
    });
  });

  it('leaves the requested annotation unselected', async () => {
    renderDocument(pdfAnnotation_2.id);

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_2.id]);
    });

    // Check no highlight is selected, as a selected one opens its toolbar
    expect(screen.getByTestId('selected').textContent).toBe('');
  });

  it('brings forward an annotation requested after the document loads', async () => {
    const { rerender } = renderDocument();

    // Let the load effect settle
    await act(async () => {});

    rerender(
      <AnnotatedPdfDocument
        path={pdfDocumentPath}
        focusRequest={{
          path: pdfDocumentPath,
          annotationId: pdfAnnotation_2.id,
        }}
      />,
    );

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_2.id]);
    });
  });

  it('brings an annotation forward again on a repeated request', async () => {
    const { rerender } = renderDocument(pdfAnnotation_1.id);

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_1.id]);
    });

    // Repeat the request with a new request object
    rerender(
      <AnnotatedPdfDocument
        path={pdfDocumentPath}
        focusRequest={{
          path: pdfDocumentPath,
          annotationId: pdfAnnotation_1.id,
        }}
      />,
    );

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_1.id, pdfAnnotation_1.id]);
    });
  });

  it('ignores a request for an annotation the document does not have', async () => {
    renderDocument('missing');

    // Let the load effect settle
    await act(async () => {});

    expect(scrolledTo).toEqual([]);
  });

  it('brings a requested annotation forward only once per request', async () => {
    // The request, kept across renders
    const focusRequest = {
      path: pdfDocumentPath,
      annotationId: pdfAnnotation_1.id,
    };
    const { rerender } = render(
      <AnnotatedPdfDocument
        path={pdfDocumentPath}
        focusRequest={focusRequest}
      />,
    );

    await waitFor(() => {
      expect(scrolledTo).toEqual([pdfAnnotation_1.id]);
    });

    // Change the highlights without a new request
    await act(async () => {
      screen.getByText('highlight').click();
    });
    rerender(
      <AnnotatedPdfDocument
        path={pdfDocumentPath}
        focusRequest={focusRequest}
      />,
    );

    expect(scrolledTo).toEqual([pdfAnnotation_1.id]);
  });
});
