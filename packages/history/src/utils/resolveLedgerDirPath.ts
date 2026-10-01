import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { LedgersDirName } from '../constants';
import { Ledger } from '../types';

/**
 * Returns the absolute path of a ledger's directory, which holds its
 * log files.
 *
 * @param ledger - The ledger to resolve the directory of.
 * @returns The absolute ledger directory path.
 */
export function resolveLedgerDirPath(ledger: Ledger): string {
  return Fs.concatPath(
    ledger.ownerPath,
    Paths.hiddenDirName,
    LedgersDirName,
    ledger.type,
  );
}
