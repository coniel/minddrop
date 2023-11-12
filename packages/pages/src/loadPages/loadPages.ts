import { FileEntry, Fs } from '@minddrop/core';
import { getDirFilesRecursiveFlat } from '../utils';
import { getPageFromPath } from '../getPageFromPath';
import { PagesStore } from '../PagesStore';
import { Events } from '@minddrop/events';

/**
 * Loads pages from the specified directories into the pages
 * store. Dispatches a 'pages:load' event.
 *
 * @param sources - Paths of the directories from which to load pages.
 */
export async function loadPages(sources: string[]): Promise<void> {
  // Filter sources to only include dirs that exist
  const validSources = await filterValidSources(sources);

  // Recursively fetch files from sources dirs
  const files = await getFiles(validSources);

  // Get markdown files
  const markdownFiles = files.filter((file) => file.path.endsWith('.md'));

  // Create page objects from markdown files
  const pages = await Promise.all(
    markdownFiles.map(async (file) => getPageFromPath(file.path)),
  );

  // Load pages into the store
  PagesStore.getState().load(pages);

  // Dispatch a 'pages:load' event
  Events.dispatch('pages:load', pages);
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
async function getFiles(sources: string[]): Promise<FileEntry[]> {
  const files = await Promise.all(
    sources.flatMap(async (source) => getDirFilesRecursiveFlat(source)),
  );

  return files.flat();
}
