import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { PagesStore } from '../PagesStore';
import { PageFileExtension } from '../constants';
import { PagesLoadedEvent, PagesLoadedEventData } from '../events';
import { readPage } from '../readPage';
import { getPagesDirPath } from '../utils';

/**
 * Initializes pages by loading page configs from the pages
 * directory.
 *
 * If the pages directory does not exist, it will be created.
 */
export async function initializePages(): Promise<void> {
  const pagesDirPath = getPagesDirPath();

  // Ensure that the pages directory exists
  await Fs.ensureDir(pagesDirPath);

  // Load pages from the pages directory
  const files = await Fs.readDir(pagesDirPath);

  // Filter out files that are not page configs
  const pageFilePaths = files
    .filter((file) => file.path.endsWith(PageFileExtension))
    .map((file) => file.path);

  // Read the page files
  const pagePromises = await Promise.all(
    pageFilePaths.map((path) => readPage(path)),
  );

  // Filter out null pages
  const pages = pagePromises.filter((page) => page !== null);

  // Load the pages into the store
  PagesStore.load(pages);

  // Dispatch a pages loaded event
  Events.dispatch<PagesLoadedEventData>(PagesLoadedEvent, pages);
}
