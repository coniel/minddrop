import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DatabaseConfigFileName, MetadataDirName } from '../../constants';
import { Database } from '../../types';
import { isEntryFilePath } from '../isEntryFilePath';
import { resolveDatabasePath } from '../resolveDatabasePath';

export type DatabaseFilePathKind =
  // An entry's primary file, by its path relative to the database
  | { kind: 'entry'; entryPath: string }
  // An entry's metadata sidecar, by its metadata key
  | { kind: 'metadata'; metadataKey: string }
  // The database directory itself, its hidden directory, or its config
  | { kind: 'database' }
  // Other app state in the hidden directory (views, designs, history)
  | { kind: 'app-state' }
  // Anything else in the database directory, such as property files
  | { kind: 'other' };

/**
 * Classifies a path inside a database directory by what it holds.
 *
 * @param path - The absolute path, inside the database's directory.
 * @param database - The database the path is in.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns What the path holds.
 */
export function resolveDatabaseFilePathKind(
  path: string,
  database: Database,
  workspacePath?: string,
): DatabaseFilePathKind {
  // Resolve the database directory's path
  const databasePath = resolveDatabasePath(database, workspacePath);

  // Classify the database directory itself as the database
  if (path === databasePath) {
    return { kind: 'database' };
  }

  // Split the path relative to the database
  const segments = Fs.relativePath(databasePath, path).split('/');

  // Classify the paths in the hidden directory
  if (segments[0] === Paths.hiddenDirName) {
    return classifyHiddenPath(segments.slice(1));
  }

  // Classify the database's entry files
  if (isEntryFilePath(segments.join('/'), database)) {
    return { kind: 'entry', entryPath: segments.join('/') };
  }

  // Classify anything else as other
  return { kind: 'other' };
}

/**
 * Classifies a path inside a database's hidden directory.
 *
 * @param segments - The path's segments, relative to the hidden directory.
 * @returns What the path holds.
 */
function classifyHiddenPath(segments: string[]): DatabaseFilePathKind {
  // Classify the hidden directory and the database config as the
  // database.
  if (!segments.length || segments.join('/') === DatabaseConfigFileName) {
    return { kind: 'database' };
  }

  // Classify a metadata sidecar by its key
  if (
    segments.length === 2 &&
    segments[0] === MetadataDirName &&
    segments[1].endsWith('.json')
  ) {
    return { kind: 'metadata', metadataKey: Fs.removeExtension(segments[1]) };
  }

  // Classify anything else in the hidden directory as app state
  return { kind: 'app-state' };
}
