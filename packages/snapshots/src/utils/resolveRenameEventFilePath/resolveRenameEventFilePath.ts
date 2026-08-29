import { Fs } from '@minddrop/file-system';
import { slugify } from '@minddrop/utils';
import { RenameEventFileExtension } from '../../constants';
import { RenameEvent } from '../../types';
import { resolveRenamesDirPath } from '../resolveRenamesDirPath';

/**
 * Returns the absolute file path at which a rename event is stored.
 *
 * The file name combines the event's timestamp with a slug of the
 * renamed entity's new name.
 *
 * @param event - The rename event.
 * @returns The absolute event file path.
 */
export function resolveRenameEventFilePath(event: RenameEvent): string {
  // Strip separator characters from the ISO timestamp, colons are
  // not valid in file names on all platforms
  const timestamp = event.timestamp.toISOString().replace(/[-:.]/g, '');

  // Slugify the renamed entity's new name to keep the file name
  // legible
  const slug = slugify(Fs.fileNameFromPath(event.to));

  // Fall back to a generic slug when the name has no usable characters
  const fileName = `${timestamp}-${slug || 'rename'}`;

  return Fs.concatPath(
    resolveRenamesDirPath(),
    `${fileName}.${RenameEventFileExtension}`,
  );
}
