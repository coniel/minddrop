import { FsEntry, Fs } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { getDirFilesRecursiveFlat } from '../utils';
import { getDocumentFromPath } from '../getDocumentFromPath';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';

/**
 * Loads documents from the specified directories into the documents
 * store. Dispatches a 'documents:load' event.
 *
 * @param sources - Paths of the directories from which to load documents.
 */
export async function loadDocuments(sources: string[]): Promise<void> {
  // Filter sources to only include dirs that exist
  const validSources = await filterValidSources(sources);

  // Recursively fetch files from sources dirs
  const files = await getFiles(validSources);

  // Get markdown files
  const markdownFiles = files.filter((file) => file.path.endsWith('.md'));

  // Create document objects from markdown files
  const documents = await Promise.all(
    markdownFiles.map(async (file) => getDocumentFromPath(file.path)),
  );

  // Filter out documents which are already in the store.
  // Note: we filter out existing documents only after
  // fetching all of them because the existing documents
  // may have changed in the time it takes to complete the
  // async processes above.
  const uniqueDocuments = documents.filter((document) => !getDocument(document.path));

  // Load documents into the store
  DocumentsStore.getState().load(uniqueDocuments);

  // Dispatch a 'documents:load' event
  Events.dispatch('documents:load', documents);
}

// Filters sources to only include paths that exists
async function filterValidSources(sources: string[]): Promise<string[]> {
  const validOrNull = await Promise.all(
    sources.map(async (source) => ((await Fs.exists(source)) ? source : null)),
  );

  return validOrNull.filter((source) => source !== null) as string[];
}

// Recersively gets all files from all sources as a list
// of file entries.
async function getFiles(sources: string[]): Promise<FsEntry[]> {
  const files = await Promise.all(
    sources.flatMap(async (source) => getDirFilesRecursiveFlat(source)),
  );

  return files.flat();
}
