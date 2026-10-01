import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveAnchorFragment } from '@minddrop/ast';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import {
  DatabaseFixtures,
  getEntryFocusRequest,
} from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { ViewSessions, Views } from '@minddrop/views';
import {
  DatabaseEntryViewName,
  DatabaseViewName,
  EventListenerId,
} from '../events';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { resolveDatabaseEntryViewId } from '../utils';
import { DatabasesFeature } from './DatabasesFeature';

const {
  objectDatabase,
  objectEntry1,
  rootStorageEntry1,
  databaseEntry_pdf_1,
  databaseEntry_pdf_1PropertyFilePath,
} = DatabaseFixtures;
const { pdfAnnotation_1, pdfAnnotations } = PdfAnnotationFixtures;

// The path of the pdf entry's document
const pdfPath = databaseEntry_pdf_1PropertyFilePath;

// The view area links are opened from
const viewAreaId = 'view-area';

describe('DatabasesFeature', () => {
  beforeEach(setup);

  afterEach(async () => {
    ViewSessions.Store.clear();
    await cleanup();
  });

  it('opens database view on open database view event', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(Views.events.Open, EventListenerId, (data) => {
        // Should include the database view name
        expect(data.view).toBe(DatabaseViewName);
        expect(data.props!.databaseId).toBe(objectDatabase.id);
        resolve();
      });

      Events.dispatch(Databases.events.OpenView, {
        databaseId: objectDatabase.id,
      });
    }));

  it('asks the entry to bring a linked fragment forward', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(DatabaseEntries.events.OpenView, 'test', (data) => {
        expect(data.entryId).toBe(rootStorageEntry1.id);
        expect(getEntryFocusRequest()).toMatchObject({
          entryId: rootStorageEntry1.id,
          fragment: '^abcd1234',
        });
        resolve();
      });

      Events.dispatch(Events.events.OpenReference, {
        reference: rootStorageEntry1.title,
        fragment: '^abcd1234',
      });
    }));

  it("brings a linked fragment forward in place when the entry shows in the link's session", async () => {
    // Whether the entry was opened
    let opened = false;

    render(<DatabasesFeature />);

    // Show the entry in the main pane, beside the note in the split
    ViewSessions.create(viewAreaId);
    ViewSessions.recordViewArea(viewAreaId, {
      viewAreaId,
      main: {
        view: DatabaseEntryViewName,
        id: resolveDatabaseEntryViewId(rootStorageEntry1.id),
      },
      split: {
        view: DatabaseEntryViewName,
        id: resolveDatabaseEntryViewId(objectEntry1.id),
      },
      splitRatio: 50,
    });

    Events.addListener(DatabaseEntries.events.OpenView, 'test', () => {
      opened = true;
    });

    Events.dispatch(Events.events.OpenReference, {
      reference: rootStorageEntry1.title,
      fragment: '^abcd1234',
      viewAreaId,
      sourcePane: 'split',
    });

    // Let the listeners run
    await Events.tests.awaitAllListeners();

    expect(opened).toBe(false);
    expect(getEntryFocusRequest()).toMatchObject({
      entryId: rootStorageEntry1.id,
      fragment: '^abcd1234',
    });
  });

  it("brings a linked annotation forward in place when a reader of its document renders in the link's view area", async () => {
    // Whether the entry was opened
    let opened = false;

    setupPdfFixtures();
    PdfAnnotations.load(pdfPath, pdfAnnotations);

    // Render the feature beside a reader of the entry's document
    render(
      <>
        <DatabasesFeature />
        <PdfReaderStandIn path={pdfPath} />
      </>,
    );

    Events.addListener(DatabaseEntries.events.OpenView, 'test', () => {
      opened = true;
    });

    Events.dispatch(Events.events.OpenReference, {
      reference: DatabaseEntries.resolveReference(databaseEntry_pdf_1.id),
      fragment: resolveAnchorFragment(pdfAnnotation_1.id),
      viewAreaId,
      sourcePane: 'split',
    });

    // Let the listeners run
    await Events.tests.awaitAllListeners();

    expect(opened).toBe(false);
  });

  it("asks the document's readers to bring a linked annotation forward", async () => {
    setupPdfFixtures();
    PdfAnnotations.load(pdfPath, pdfAnnotations);

    render(
      <>
        <DatabasesFeature />
        <PdfReaderStandIn path={pdfPath} />
      </>,
    );

    Events.dispatch(Events.events.OpenReference, {
      reference: DatabaseEntries.resolveReference(databaseEntry_pdf_1.id),
      fragment: resolveAnchorFragment(pdfAnnotation_1.id),
      viewAreaId,
      sourcePane: 'split',
    });

    expect(await screen.findByText(pdfAnnotation_1.id)).toBeInTheDocument();
  });

  it('opens a linked entry when nothing in the view area brings its fragment forward', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(DatabaseEntries.events.OpenView, 'test', (data) => {
        expect(data.entryId).toBe(rootStorageEntry1.id);
        resolve();
      });

      Events.dispatch(Events.events.OpenReference, {
        reference: rootStorageEntry1.title,
        fragment: '^abcd1234',
        viewAreaId,
        sourcePane: 'split',
      });
    }));

  it("leaves a fragment-less link to an entry shown in the link's session unopened", async () => {
    // Whether the entry was opened
    let opened = false;

    render(<DatabasesFeature />);

    // Show the entry in the main pane
    ViewSessions.create(viewAreaId);
    ViewSessions.recordViewArea(viewAreaId, {
      viewAreaId,
      main: {
        view: DatabaseEntryViewName,
        id: resolveDatabaseEntryViewId(rootStorageEntry1.id),
      },
      split: null,
      splitRatio: 50,
    });

    Events.addListener(DatabaseEntries.events.OpenView, 'test', () => {
      opened = true;
    });

    Events.dispatch(Events.events.OpenReference, {
      reference: rootStorageEntry1.title,
      viewAreaId,
      sourcePane: 'split',
    });

    // Let the listeners run
    await Events.tests.awaitAllListeners();

    expect(opened).toBe(false);
  });

  it('opens a linked entry from the pane the link was opened from', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(DatabaseEntries.events.OpenView, 'test', (data) => {
        expect(data).toMatchObject({
          entryId: rootStorageEntry1.id,
          viewAreaId,
          sourcePane: 'split',
        });
        resolve();
      });

      Events.dispatch(Events.events.OpenReference, {
        reference: rootStorageEntry1.title,
        viewAreaId,
        sourcePane: 'split',
      });
    }));

  it('makes no focus request for a reference without a fragment', () =>
    new Promise<void>((resolve) => {
      render(<DatabasesFeature />);

      Events.addListener(DatabaseEntries.events.OpenView, 'test', () => {
        expect(getEntryFocusRequest()).toBeNull();
        resolve();
      });

      Events.dispatch(Events.events.OpenReference, {
        reference: rootStorageEntry1.title,
      });
    }));
});

interface PdfReaderStandInProps {
  /**
   * The absolute path of the PDF file the stand-in reads.
   */
  path: string;
}

/**
 * Stands in for a reader of a document in the view area links are
 * opened from. Renders the ID of the annotation it is asked to bring
 * forward.
 */
const PdfReaderStandIn: React.FC<PdfReaderStandInProps> = ({ path }) => {
  Pdf.useReader(path, viewAreaId);

  // The annotation the reader is asked to bring forward
  const focusRequest = Pdf.useAnnotationFocusRequest(path);

  return <div>{focusRequest?.annotationId}</div>;
};
