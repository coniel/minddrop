import { DatabaseEntries } from '@minddrop/databases';
import { loadEntryPdfs } from './loadEntryPdfs';

/**
 * Loads the annotations and the page last read every entry of the
 * active workspace keeps for its pdf properties into the pdf stores.
 */
export function loadWorkspaceEntryPdfs(): void {
  DatabaseEntries.getAll().forEach(loadEntryPdfs);
}
