import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import {
  DatabaseConfigFileName,
  DatabaseContentViewsDirName,
  DatabaseDesignsDirName,
  EntryTemplateConfigFileName,
  EntryTemplatesDirName,
  MetadataDirName,
} from '../../constants';
import { Database } from '../../types';
import { isEntryFilePath } from '../isEntryFilePath';
import { resolveDatabasePath } from '../resolveDatabasePath';

export type DatabaseFilePathKind =
  // An entry's primary file, by its path relative to the database
  | { kind: 'entry'; entryPath: string }
  // An entry's metadata sidecar, by its metadata key
  | { kind: 'metadata'; metadataKey: string }
  // The database directory itself, or its hidden directory
  | { kind: 'database' }
  // The database's config file
  | { kind: 'config' }
  // A database-owned view's file, by the view's ID
  | { kind: 'view'; viewId: string }
  // A database-owned design's file, by the design's ID
  | { kind: 'design'; designId: string }
  // An entry template's directory or config file, by the template's ID
  | { kind: 'entry-template'; templateId: string }
  // Other app state in the hidden directory, such as history
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
  // Classify the hidden directory itself as the database
  if (!segments.length) {
    return { kind: 'database' };
  }

  // Path relative to the hidden directory
  const hiddenPath = segments.join('/');

  // Classify the database config
  if (hiddenPath === DatabaseConfigFileName) {
    return { kind: 'config' };
  }

  // Classify a metadata sidecar by its key
  const metadataKey = Fs.resolveFileIdInDir(
    hiddenPath,
    MetadataDirName,
    'json',
  );

  if (metadataKey) {
    return { kind: 'metadata', metadataKey };
  }

  // Classify a view file by its view's ID
  const viewId = Fs.resolveFileIdInDir(
    hiddenPath,
    DatabaseContentViewsDirName,
    'json',
  );

  if (viewId) {
    return { kind: 'view', viewId };
  }

  // Classify a design file by its design's ID
  const designId = Fs.resolveFileIdInDir(
    hiddenPath,
    DatabaseDesignsDirName,
    'json',
  );

  if (designId) {
    return { kind: 'design', designId };
  }

  // Classify an entry template's directory or config file by the
  // template's ID. The template's other files hold property values
  // the store does not have.
  if (
    segments[0] === EntryTemplatesDirName &&
    (segments.length === 2 ||
      (segments.length === 3 && segments[2] === EntryTemplateConfigFileName))
  ) {
    return { kind: 'entry-template', templateId: segments[1] };
  }

  // Classify anything else in the hidden directory as app state
  return { kind: 'app-state' };
}
