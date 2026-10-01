import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveAnchorFragment } from '@minddrop/ast';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  InsertEditorReferenceEvent,
  InsertEditorReferenceEventData,
} from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Pdf, PdfAnnotation, PdfAnnotations } from '@minddrop/pdf';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { waitFor } from '@minddrop/test-utils';
import { Workspaces } from '@minddrop/workspaces';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, setup, setupPdfFixtures } from '../test-utils';
import { initializeEntryPdfs } from './initializeEntryPdfs';

const {
  database_pdf,
  databaseEntry_pdf_1,
  databaseEntry_pdf_2,
  databaseEntry_pdf_1PropertyFilePath,
  pdfPropertyName,
  validPdfPropertyFile,
} = DatabaseFixtures;
const { pdfAnnotation_1, pdfAnnotation_2, pdfAnnotations } =
  PdfAnnotationFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The path of the first pdf entry's document
const path = databaseEntry_pdf_1PropertyFilePath;

describe('initializeEntryPdfs', () => {
  let removeEventListeners: VoidFunction;

  beforeEach(() => {
    setup();
    setupPdfFixtures();

    removeEventListeners = initializeEntryPdfs();
  });

  afterEach(async () => {
    removeEventListeners();
    await cleanup();
  });

  it("loads the entries' annotations when the workspace loads", async () => {
    // Remove the second pdf entry. It shares the first's file name, so
    // under the fixture database's property storage it would load its
    // lack of annotations over the first's.
    DatabaseEntries.Store.remove(databaseEntry_pdf_2.id);

    // Give the entry annotations for its pdf property
    storeEntryAnnotations(databaseEntry_pdf_1.id, pdfAnnotations);

    Events.dispatch(Workspaces.events.WorkspaceLoaded, workspace_1);

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(path, {
        path,
        annotations: pdfAnnotations,
      });
    });
  });

  it("loads a created entry's annotations", async () => {
    const entry = storeEntryAnnotations(databaseEntry_pdf_1.id, pdfAnnotations);

    Events.dispatch(DatabaseEntries.events.Created, entry);

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(path, {
        path,
        annotations: pdfAnnotations,
      });
    });
  });

  it("loads a duplicated entry's annotations", async () => {
    // Give the duplicate annotations. Under the fixture database's
    // property storage it shares the original's file.
    const duplicate = storeEntryAnnotations(
      databaseEntry_pdf_2.id,
      pdfAnnotations,
    );

    Events.dispatch(DatabaseEntries.events.Duplicated, {
      original: databaseEntry_pdf_1,
      duplicate,
    });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(path, {
        path,
        annotations: pdfAnnotations,
      });
    });
  });

  it("reloads an updated entry's annotations", async () => {
    PdfAnnotations.load(path, []);

    // Give the entry annotations for its pdf property
    const updated = storeEntryAnnotations(
      databaseEntry_pdf_1.id,
      pdfAnnotations,
    );

    Events.dispatch(DatabaseEntries.events.Updated, {
      original: databaseEntry_pdf_1,
      updated,
    });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(path, {
        path,
        annotations: pdfAnnotations,
      });
    });
  });

  it("persists a created annotation to the entry property's metadata", async () => {
    // The fixture annotation's data, without its ID and timestamp
    const { id: fixtureId, created: fixtureCreated, ...data } = pdfAnnotation_1;

    const annotation = PdfAnnotations.create(path, data);

    await waitFor(() => {
      expect(
        storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
          .properties?.[pdfPropertyName],
      ).toEqual({ annotations: [annotation] });
    });
  });

  it("persists a recoloured annotation to the entry property's metadata", async () => {
    PdfAnnotations.load(path, pdfAnnotations);

    const recoloured = PdfAnnotations.update(path, pdfAnnotation_1.id, {
      color: 'green',
    });

    await waitFor(() => {
      expect(
        storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
          .properties?.[pdfPropertyName],
      ).toEqual({ annotations: [recoloured, pdfAnnotation_2] });
    });
  });

  it("persists a deleted annotation's removal", async () => {
    PdfAnnotations.load(path, pdfAnnotations);

    PdfAnnotations.delete(path, pdfAnnotation_1.id);

    await waitFor(() => {
      expect(
        storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
          .properties?.[pdfPropertyName],
      ).toEqual({ annotations: [pdfAnnotation_2] });
    });
  });

  it("persists the page last read to the entry property's metadata", async () => {
    Pdf.setReadPage(path, 6);

    await waitFor(() => {
      expect(
        storeItem(DatabaseEntries.Store, databaseEntry_pdf_1.id).metadata
          .properties?.[pdfPropertyName],
      ).toEqual({ page: 6 });
    });
  });

  it("quotes an annotation into the editor of the pane it was sent from, linking to the entry's annotation", async () => {
    const inserted = new Promise<InsertEditorReferenceEventData>((resolve) => {
      Events.addListener(InsertEditorReferenceEvent, 'test', resolve);
    });

    Events.dispatch(PdfAnnotations.events.QuoteRequested, {
      path,
      annotation: pdfAnnotation_1,
      viewAreaId: 'view-area',
      sourcePane: 'main',
    });

    expect(await inserted).toEqual({
      viewAreaId: 'view-area',
      pane: 'main',
      reference: DatabaseEntries.resolveReference(databaseEntry_pdf_1.id),
      fragment: resolveAnchorFragment(pdfAnnotation_1.id),
      label: pdfAnnotation_1.text,
      quote: true,
    });
  });

  it("unloads a deleted entry's annotations", async () => {
    PdfAnnotations.load(path, pdfAnnotations);

    Events.dispatch(DatabaseEntries.events.Deleted, databaseEntry_pdf_1);

    await waitFor(() => {
      expect(PdfAnnotations.Store).not.toHaveItem(path);
    });
  });

  it("unloads the cleared entries' annotations", async () => {
    // Switch the database to entry storage, under which each entry's
    // file has a path of its own.
    Databases.Store.update(database_pdf.id, { propertyFileStorage: 'entry' });

    const entries = [databaseEntry_pdf_1, databaseEntry_pdf_2];

    entries.forEach((entry) => {
      PdfAnnotations.load(entryPropertyFilePath(entry), pdfAnnotations);
    });

    Events.dispatch(DatabaseEntries.events.Cleared, {
      databaseId: database_pdf.id,
      entries,
    });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItemCount(0);
    });
  });

  it("moves a renamed entry's annotations to the file's new path", async () => {
    // Switch the database to entry storage, under which the file moves
    // with the entry's title.
    Databases.Store.update(database_pdf.id, { propertyFileStorage: 'entry' });

    // The entry before and after the rename
    const original = databaseEntry_pdf_1;
    const updated = {
      ...original,
      title: 'Renamed',
      path: 'Renamed/Renamed.md',
    };
    // The file's path before and after
    const fromPath = entryPropertyFilePath(original);
    const toPath = entryPropertyFilePath(updated);

    PdfAnnotations.load(fromPath, pdfAnnotations);

    Events.dispatch(DatabaseEntries.events.Renamed, { original, updated });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(toPath, {
        path: toPath,
        annotations: pdfAnnotations,
      });
    });

    expect(PdfAnnotations.Store).not.toHaveItem(fromPath);
  });

  it("reloads the entries' annotations when the database moves its property files", async () => {
    // Give the entry annotations for its pdf property
    storeEntryAnnotations(databaseEntry_pdf_1.id, pdfAnnotations);

    // Move the database's files into its entries' directories
    Databases.Store.update(database_pdf.id, { propertyFileStorage: 'entry' });

    // The file's path after the move
    const movedPath = entryPropertyFilePath(databaseEntry_pdf_1);

    Events.dispatch(Databases.events.Updated, {
      original: database_pdf,
      updated: Databases.get(database_pdf.id),
    });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(movedPath, {
        path: movedPath,
        annotations: pdfAnnotations,
      });
    });
  });

  it("reloads the entries' annotations when the database renames its property files directory", async () => {
    // Remove the second pdf entry. It shares the first's file name, so
    // under common storage it would load its lack of annotations over
    // the first's.
    DatabaseEntries.Store.remove(databaseEntry_pdf_2.id);

    // Give the entry annotations for its pdf property
    storeEntryAnnotations(databaseEntry_pdf_1.id, pdfAnnotations);

    // Switch the database to common storage in a renamed directory
    Databases.Store.update(database_pdf.id, {
      propertyFileStorage: 'common',
      propertyFilesDir: 'Files',
    });

    // The file's path after the rename
    const movedPath = entryPropertyFilePath(databaseEntry_pdf_1);

    Events.dispatch(Databases.events.Updated, {
      original: {
        ...Databases.get(database_pdf.id),
        propertyFilesDir: 'Media',
      },
      updated: Databases.get(database_pdf.id),
    });

    await waitFor(() => {
      expect(PdfAnnotations.Store).toHaveItem(movedPath, {
        path: movedPath,
        annotations: pdfAnnotations,
      });
    });
  });

  it('leaves the annotations alone when a database change moves no files', async () => {
    // Give the entry annotations for its pdf property
    storeEntryAnnotations(databaseEntry_pdf_1.id, pdfAnnotations);

    Events.dispatch(Databases.events.Updated, {
      original: database_pdf,
      updated: { ...database_pdf, name: 'Renamed' },
    });

    // Let the dispatch reach its listeners
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(PdfAnnotations.Store).not.toHaveItem(path);
  });
});

/**
 * Stores annotations in a pdf entry's property metadata, as an entry
 * read from disk holds them.
 *
 * @param entryId - The ID of the pdf entry.
 * @param annotations - The annotations to store.
 * @returns The entry with the annotations stored.
 */
function storeEntryAnnotations(
  entryId: string,
  annotations: PdfAnnotation[],
): DatabaseEntry {
  DatabaseEntries.Store.update(entryId, {
    metadata: { properties: { [pdfPropertyName]: { annotations } } },
  });

  return DatabaseEntries.get(entryId);
}

/**
 * Resolves the path of a pdf entry's document under its database's
 * current property file storage.
 *
 * @param entry - The pdf entry.
 * @returns The document's path.
 */
function entryPropertyFilePath(entry: DatabaseEntry): string {
  return DatabaseEntries.propertyFilePath(
    entry,
    pdfPropertyName,
    validPdfPropertyFile.name,
  );
}
