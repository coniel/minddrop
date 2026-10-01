import React, { useEffect, useImperativeHandle } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { Pdf, PdfAnnotationFocusRequest, PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { PropertiesSchema } from '@minddrop/properties';
import { act, render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import {
  DesignPropertiesProvider,
  DesignPropertiesProviderProps,
} from '@minddrop/ui-designs-next';
import type {
  AnnotatedPdfDocumentProps,
  PdfDocumentHandle,
  PdfToolbarProps,
} from '@minddrop/ui-pdf';
import { PdfFixtures } from '@minddrop/ui-pdf/test-utils';
import { Toolbar } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { cleanup, setup } from '../../../test-utils';
import { PdfElement } from '../PdfElement.types';
import { PdfElementConfig } from '../PdfElementConfig';
import { PdfElementRenderer } from './PdfElementRenderer';

const { bodyDesignElement } = DesignElementFixtures;
const { pdfAnnotation_1, pdfDocumentPath, pdfDocumentPath_unannotated } =
  PdfAnnotationFixtures;
const { pdfTextSelection_1 } = PdfFixtures;

// The path of the document the element shows
const path = pdfDocumentPath;

// The name of the pdf property the element renders
const propertyName = 'Paper';

// The properties of the design the element renders in
const properties: PropertiesSchema = [{ type: 'pdf', name: propertyName }];

// The number of pages the stand-in document loads with
const pageCount = 5;
// The page the stand-in document reports scrolling to
const visiblePage = 3;
// The zoom the stand-in toolbar reports picking
const pickedZoom = 2;

// The pages the stand-in document was scrolled to. Recorded through
// the handle. This pins the handle contract the renderer relies on.
const scrolledTo: number[] = [];

// The requests the stand-in document was given to bring an annotation
// forward, in the order it received them.
const focusRequests: PdfAnnotationFocusRequest[] = [];

// The view area the element renders in when rendered in one
const viewAreaId = 'view-area';

// Stand the reader in with a probe of the annotation it is asked to
// bring forward, the actions it offers on a selection, buttons
// standing for the document loading and being scrolled, and a handle
// recording what it is scrolled to. Stand its toolbar in with a
// button standing for a zoom pick and the actions it is given. The
// reader renders through pdf.js, which has no canvas here.
vi.mock('@minddrop/ui-pdf', () => ({
  AnnotatedPdfDocument: React.forwardRef<
    PdfDocumentHandle,
    AnnotatedPdfDocumentProps
  >(function AnnotatedPdfDocumentStandIn(
    {
      path: documentPath,
      zoom,
      focusRequest,
      renderSelectionActions,
      onDocumentLoad,
      onVisiblePageChange,
    },
    ref,
  ) {
    useImperativeHandle(ref, () => ({
      scrollToPage: (page) => {
        scrolledTo.push(page);
      },
      scrollToHighlight: () => {},
    }));

    // Record each request to bring an annotation forward
    useEffect(() => {
      if (focusRequest) {
        focusRequests.push(focusRequest);
      }
    }, [focusRequest]);

    return (
      <div
        data-testid="pdf-document"
        data-path={documentPath}
        data-zoom={zoom}
        data-focus={focusRequest?.annotationId ?? ''}
      >
        <Toolbar>{renderSelectionActions?.(pdfTextSelection_1)}</Toolbar>
        <button type="button" onClick={() => onDocumentLoad?.({ pageCount })}>
          load
        </button>
        <button
          type="button"
          onClick={() => onVisiblePageChange?.(visiblePage)}
        >
          scroll
        </button>
      </div>
    );
  }),
  PdfToolbar: ({ onZoomChange, children }: PdfToolbarProps) => (
    <Toolbar data-testid="pdf-toolbar">
      <button type="button" onClick={() => onZoomChange(pickedZoom)}>
        zoom
      </button>
      {children}
    </Toolbar>
  ),
}));

const pdfElement: PdfElement = {
  ...bodyDesignElement,
  type: PdfElementConfig.type,
  property: propertyName,
};

/**
 * Renders the PDF element inside a design which has or lacks a mapped
 * markdown editor.
 *
 * @param values - The property values the design provides.
 * @param hasMappedMarkdownEditor - Whether the design has a mapped markdown editor.
 * @returns The render result.
 */
function renderElement(
  values: DesignPropertiesProviderProps['values'],
  hasMappedMarkdownEditor = false,
) {
  return render(
    <DesignPropertiesProvider
      properties={properties}
      values={values}
      hasMappedMarkdownEditor={hasMappedMarkdownEditor}
    >
      <PdfElementRenderer element={pdfElement} />
    </DesignPropertiesProvider>,
  );
}

/**
 * Renders the PDF element, showing the document, in the main pane of
 * the view area.
 *
 * @returns The render result.
 */
function renderInViewArea() {
  return render(
    <Views.PaneProvider viewAreaId={viewAreaId} pane="main">
      <DesignPropertiesProvider
        properties={properties}
        values={{ [propertyName]: path }}
      >
        <PdfElementRenderer element={pdfElement} />
      </DesignPropertiesProvider>
    </Views.PaneProvider>,
  );
}

describe('<PdfElementRenderer />', () => {
  beforeEach(() => {
    setup();
    PdfAnnotations.load(path, [pdfAnnotation_1]);
    scrolledTo.length = 0;
    focusRequests.length = 0;
  });

  afterEach(cleanup);

  it("renders the file at the property's path in the reader", () => {
    renderElement({ [propertyName]: path });

    expect(screen.getByTestId('pdf-document').dataset.path).toBe(path);
  });

  it('renders no reader while the property holds no file', () => {
    renderElement({ [propertyName]: null });

    expect(screen.queryByTestId('pdf-document')).toBeNull();
  });

  it('shows the reading toolbar while collapsed', () => {
    renderElement({ [propertyName]: path });

    expect(screen.getByTestId('pdf-toolbar')).toBeInTheDocument();
  });

  it('renders the pages at the picked zoom while collapsed', async () => {
    const user = userEvent.setup();

    renderElement({ [propertyName]: path });

    await user.click(screen.getByText('zoom'));

    expect(screen.getByTestId('pdf-document').dataset.zoom).toBe(
      `${pickedZoom}`,
    );
  });

  it('keeps the picked zoom when expanded', async () => {
    const user = userEvent.setup();

    renderElement({ [propertyName]: path });

    await user.click(screen.getByText('zoom'));
    await user.click(screen.getByLabelText('pdf.element.expand'));

    expect(screen.getByTestId('pdf-document').dataset.zoom).toBe(
      `${pickedZoom}`,
    );
  });

  it('collapses again after expanding', async () => {
    const user = userEvent.setup();

    renderElement({ [propertyName]: path });

    await user.click(screen.getByLabelText('pdf.element.expand'));
    await user.click(screen.getByLabelText('pdf.element.collapse'));

    expect(screen.getByLabelText('pdf.element.expand')).toBeInTheDocument();
  });

  it('records the page read in the document', async () => {
    const user = userEvent.setup();

    renderElement({ [propertyName]: path });

    await user.click(screen.getByText('scroll'));

    await waitFor(() => {
      expect(Pdf.getReadPage(path)).toBe(visiblePage);
    });
  });

  it('returns to the page last read once the document loads', async () => {
    const user = userEvent.setup();

    // Record the document as last read on its fourth page
    Pdf.loadReadPage(path, 4);

    renderElement({ [propertyName]: path });

    await user.click(screen.getByText('load'));

    expect(scrolledTo).toEqual([4]);
  });

  it('offers sending a selection to a note when the design has a mapped markdown editor', () => {
    renderElement({ [propertyName]: path }, true);

    expect(screen.getByLabelText('pdf.sendToNote.label')).toBeInTheDocument();
  });

  it('offers no send to note action while the design has no mapped markdown editor', () => {
    renderElement({ [propertyName]: path });

    expect(screen.queryByLabelText('pdf.sendToNote.label')).toBeNull();
  });

  it('brings the annotation a request names forward', () => {
    Pdf.requestAnnotationFocus(path, pdfAnnotation_1.id);

    renderElement({ [propertyName]: path });

    expect(screen.getByTestId('pdf-document').dataset.focus).toBe(
      pdfAnnotation_1.id,
    );
  });

  it("ignores requests naming another document's annotation", () => {
    Pdf.requestAnnotationFocus(pdfDocumentPath_unannotated, pdfAnnotation_1.id);

    renderElement({ [propertyName]: path });

    expect(screen.getByTestId('pdf-document').dataset.focus).toBe('');
  });

  it('registers as reading its document in its view area', () => {
    renderInViewArea();

    expect(Pdf.hasReader(path, viewAreaId)).toBe(true);
  });

  it('asks the reader again when the same annotation is requested again', () => {
    renderElement({ [propertyName]: path });

    // Request the annotation twice
    act(() => {
      Pdf.requestAnnotationFocus(path, pdfAnnotation_1.id);
    });
    act(() => {
      Pdf.requestAnnotationFocus(path, pdfAnnotation_1.id);
    });

    expect(focusRequests).toEqual([
      { path, annotationId: pdfAnnotation_1.id },
      { path, annotationId: pdfAnnotation_1.id },
    ]);
  });

  it('asks the reader only once per request', () => {
    renderElement({ [propertyName]: path });

    act(() => {
      Pdf.requestAnnotationFocus(path, pdfAnnotation_1.id);
    });

    // Re-render the element without a new request, by changing the
    // page it records as last read.
    act(() => {
      Pdf.loadReadPage(path, 2);
    });

    expect(focusRequests).toHaveLength(1);
  });
});
