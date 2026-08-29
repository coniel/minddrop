import { Fs } from '@minddrop/file-system';
import { RenameEventFileExtension } from '../../constants';
import { RenameEvent } from '../../types';
import { resolveRenamesDirPath } from '../resolveRenamesDirPath';

/**
 * Reads all rename events from the workspace's rename ledger.
 *
 * @returns The recorded rename events, sorted chronologically.
 */
export async function readRenameEvents(): Promise<RenameEvent[]> {
  const renamesDirPath = resolveRenamesDirPath();

  // No events have been recorded yet
  if (!(await Fs.exists(renamesDirPath))) {
    return [];
  }

  // List the ledger directory
  const files = await Fs.readDir(renamesDirPath);

  // Ignore foreign files such as OS metadata files
  const eventFiles = files.filter(
    (file) => Fs.getFileExtension(file.path) === RenameEventFileExtension,
  );

  // Read and parse the event files
  const events = await Promise.all(
    eventFiles.map((file) => Fs.readJsonFile<RenameEvent>(file.path)),
  );

  // Sort the events chronologically
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}
