import { DatabaseEntries, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Pdf, PdfAnnotations } from '@minddrop/pdf';
import { Workspaces } from '@minddrop/workspaces';
import { EntryPdfsEventListenerId } from '../events';
import { loadEntryPdfs } from '../loadEntryPdfs';
import { loadWorkspaceEntryPdfs } from '../loadWorkspaceEntryPdfs';
import { moveEntryPdfs } from '../moveEntryPdfs';
import { persistEntryPdfAnnotations } from '../persistEntryPdfAnnotations';
import { persistEntryPdfReadPage } from '../persistEntryPdfReadPage';
import { quoteEntryPdfAnnotation } from '../quoteEntryPdfAnnotation';
import { unloadEntryPdfs } from '../unloadEntryPdfs';

/**
 * Bridges the pdf stores to the entries holding the documents: loads
 * each entry's annotations and page last read, keeps them in step with
 * entry changes, persists their changes to the entries' property
 * metadata and quotes annotations into the entries' editors.
 *
 * @returns A cleanup function which removes the event listeners.
 */
export function initializeEntryPdfs(): VoidFunction {
  // Register the listeners
  Events.addListeners(EntryPdfsEventListenerId, {
    // Load the workspace's entries' pdfs once the entries are loaded
    [Workspaces.events.WorkspaceLoaded]: () => {
      loadWorkspaceEntryPdfs();
    },
    // Load a new entry's pdfs
    [DatabaseEntries.events.Created]: (entry) => {
      loadEntryPdfs(entry);
    },
    // Load a duplicate's pdfs
    [DatabaseEntries.events.Duplicated]: ({ duplicate }) => {
      loadEntryPdfs(duplicate);
    },
    // Reload an updated entry's pdfs
    [DatabaseEntries.events.Updated]: ({ original, updated }) => {
      unloadEntryPdfs(original);
      loadEntryPdfs(updated);
    },
    // Move a renamed entry's pdfs
    [DatabaseEntries.events.Renamed]: ({ original, updated }) => {
      moveEntryPdfs(original, updated);
    },
    // Unload a deleted entry's pdfs
    [DatabaseEntries.events.Deleted]: (entry) => {
      unloadEntryPdfs(entry);
    },
    // Unload cleared entries' pdfs
    [DatabaseEntries.events.Cleared]: ({ entries }) => {
      entries.forEach(unloadEntryPdfs);
    },
    // Reload the pdfs of a database's entries when a change to where
    // it stores its property files moves them.
    [Databases.events.Updated]: ({ original, updated }) => {
      // Skip updates leaving the property file storage as it was
      if (
        original.propertyFileStorage === updated.propertyFileStorage &&
        original.propertyFilesDir === updated.propertyFilesDir
      ) {
        return;
      }

      // Reload the pdfs of every entry
      DatabaseEntries.getAll(updated.id).forEach(loadEntryPdfs);
    },
    // Persist a document's annotations as they change
    [PdfAnnotations.events.Created]: ({ path }) =>
      persistEntryPdfAnnotations(path),
    [PdfAnnotations.events.Updated]: ({ path }) =>
      persistEntryPdfAnnotations(path),
    [PdfAnnotations.events.Deleted]: ({ path }) =>
      persistEntryPdfAnnotations(path),
    // Persist the page of a document last read
    [Pdf.events.ReadPageSet]: ({ path, page }) =>
      persistEntryPdfReadPage(path, page),
    // Quote an annotation into the editor it was sent to
    [PdfAnnotations.events.QuoteRequested]: (data) => {
      quoteEntryPdfAnnotation(data);
    },
  });

  // Remove the listeners
  return () => {
    Events.removeListener(
      Workspaces.events.WorkspaceLoaded,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Created,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Duplicated,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Updated,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Renamed,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Deleted,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      DatabaseEntries.events.Cleared,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(Databases.events.Updated, EntryPdfsEventListenerId);
    Events.removeListener(
      PdfAnnotations.events.Created,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      PdfAnnotations.events.Updated,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(
      PdfAnnotations.events.Deleted,
      EntryPdfsEventListenerId,
    );
    Events.removeListener(Pdf.events.ReadPageSet, EntryPdfsEventListenerId);
    Events.removeListener(
      PdfAnnotations.events.QuoteRequested,
      EntryPdfsEventListenerId,
    );
  };
}
