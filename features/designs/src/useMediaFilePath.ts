import { useMemo } from 'react';
import { Fs } from '@minddrop/file-system';
import { useMediaDirPath } from './MediaDirContext';

/**
 * Resolves the path to a media file within the media directory of
 * the entity owning the current layout. Null when no file name is
 * given, or when no owner is in scope.
 *
 * @param fileName - The media file name.
 * @returns The path to the media file, or null.
 */
export function useMediaFilePath(fileName?: string): string | null {
  const mediaDirPath = useMediaDirPath();

  return useMemo(() => {
    // Media can only be resolved against an owner's media directory
    if (!fileName || !mediaDirPath) {
      return null;
    }

    return Fs.concatPath(mediaDirPath, fileName);
  }, [mediaDirPath, fileName]);
}
