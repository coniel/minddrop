import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';

/**
 * Derives an entry's absolute path from its durable
 * workspace-relative address.
 *
 * @param address - The workspace-relative address.
 * @returns The absolute entry file path.
 */
export function databaseEntryPathFromAddress(address: string): string {
  return Fs.concatPath(Paths.workspace, address);
}
