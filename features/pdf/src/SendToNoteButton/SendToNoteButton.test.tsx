import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  PdfAnnotationQuoteRequestedEventData,
  PdfAnnotations,
} from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { PdfFixtures } from '@minddrop/ui-pdf/test-utils';
import { Toolbar } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { SendToNoteButton } from './SendToNoteButton';

const { pdfDocumentPath } = PdfAnnotationFixtures;
const { pdfTextSelection_1 } = PdfFixtures;

const viewAreaId = 'test-view-area';

// The path of the document the selection is in
const path = pdfDocumentPath;

/**
 * Renders the button in the main pane of the view area.
 *
 * @returns The render result.
 */
function renderButton() {
  return render(
    <Views.PaneProvider viewAreaId={viewAreaId} pane="main">
      <Toolbar>
        <SendToNoteButton path={path} selection={pdfTextSelection_1} />
      </Toolbar>
    </Views.PaneProvider>,
  );
}

describe('<SendToNoteButton />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('highlights the selection and requests a quote of it from its pane', async () => {
    const user = userEvent.setup();
    const requested = new Promise<PdfAnnotationQuoteRequestedEventData>(
      (resolve) => {
        Events.addListener(
          PdfAnnotations.events.QuoteRequested,
          'test',
          resolve,
        );
      },
    );

    renderButton();

    await user.click(screen.getByLabelText('pdf.sendToNote.label'));

    // Wait for the quote to be requested
    const data = await requested;

    // Read the annotation created for the selection
    const [annotation] = storeItem(PdfAnnotations.Store, path).annotations;

    expect(annotation).toMatchObject({ text: pdfTextSelection_1.text });
    expect(data).toEqual({
      path,
      annotation,
      viewAreaId,
      sourcePane: 'main',
    });
  });

  it('sends nothing outside a view pane', async () => {
    const user = userEvent.setup();
    const requested: unknown[] = [];

    Events.addListener(PdfAnnotations.events.QuoteRequested, 'test', (data) => {
      requested.push(data);
    });

    render(
      <Toolbar>
        <SendToNoteButton path={path} selection={pdfTextSelection_1} />
      </Toolbar>,
    );

    await user.click(screen.getByLabelText('pdf.sendToNote.label'));

    expect(requested).toEqual([]);
    expect(PdfAnnotations.Store).not.toHaveItem(path);
  });
});
