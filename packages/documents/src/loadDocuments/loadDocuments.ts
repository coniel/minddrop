import { FsEntry, Fs } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { Block, Blocks } from '@minddrop/blocks';
import { getDirFilesRecursiveFlat, isDocumentFile } from '../utils';
import { getDocumentFromPath } from '../getDocumentFromPath';
import { DocumentsStore } from '../DocumentsStore';
import { getDocument } from '../getDocument';
import { Document, DocumentView } from '../types';
import { DocumentViewsStore } from '../DocumentViewsStore';

/**
 * Loads documents from the specified directories into the documents
 * store.
 *
 * @param sources - Paths of the directories from which to load documents.
 *
 * @dispatches documents:load
 * @dispatches documents:views:load
 * @dispatches blocks:load
 */
export async function loadDocuments(sources: string[]): Promise<void> {
  // Filter sources to only include dirs that exist
  const validSources = await filterValidSources(sources);

  // Recursively fetch files from sources dirs
  const files = await getFiles(validSources);

  // Get files that are registered document types
  const documentFiles = files.filter((file) => isDocumentFile(file.path));

  // Get documents, views, and blocks from document files
  const data = await Promise.all(
    documentFiles.map(async (file) => getDocumentFromPath(file.path)),
  );

  const { documents, views, blocks } = data.reduce<{
    documents: Document[];
    views: DocumentView[];
    blocks: Block[];
  }>(
    (acc, curr) => {
      acc.documents.push(curr.document);
      acc.views.push(...curr.views);
      acc.blocks.push(...curr.blocks);

      return acc;
    },
    { documents: [], views: [], blocks: [] },
  );

  // Filter out documents which are already in the store.
  // Note: we filter out existing documents only after
  // fetching all of them because the existing documents
  // may have changed in the time it takes to complete the
  // async processes above.
  const uniqueDocuments = documents.filter(
    (document) => !getDocument(document.id),
  );

  // Load documents, views, and blocks into the store
  DocumentsStore.getState().load(uniqueDocuments);
  DocumentViewsStore.getState().load(views);
  Blocks.load(blocks);

  // Dispatch document and view load events
  Events.dispatch('documents:load', documents);
  Events.dispatch('documents:views:load', views);
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
