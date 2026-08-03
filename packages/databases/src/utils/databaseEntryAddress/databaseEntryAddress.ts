import { Paths } from '@minddrop/utils';

/**
 * Derives an entry's durable workspace-relative address from
 * its absolute path.
 *
 * @param path - The absolute path of the entry file.
 * @returns The workspace-relative address.
 */
export function databaseEntryAddress(path: string): string {
  return path.replace(`${Paths.workspace}/`, '');
}
