import { Fs } from '@minddrop/file-system';
import { MediaDirName } from '../constants';
import { resolveDesignBundleDirPath } from './resolveDesignBundleDirPath';

/**
 * Returns the path to a design's media directory, which contains
 * the media files used by the design's layouts.
 *
 * @param id - The ID of the design.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the design media directory.
 */
export function resolveDesignMediaDirPath(
  id: string,
  workspacePath?: string,
): string {
  return Fs.concatPath(
    resolveDesignBundleDirPath(id, workspacePath),
    MediaDirName,
  );
}
