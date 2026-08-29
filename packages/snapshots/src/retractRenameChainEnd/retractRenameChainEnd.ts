import { Fs } from '@minddrop/file-system';
import { RenameEvent, RenameEventKind } from '../types';
import { resolveRenameChainEnds, resolveRenameEventFilePath } from '../utils';

/**
 * Retracts the terminal event of the rename chain ending at the
 * given address, so that a later unrelated occupant of the address
 * cannot falsely continue the chain.
 *
 * This is the one place ledger events are removed rather than kept
 * forever, intended solely for chains whose target entity was
 * deleted while holding a reusable default name.
 *
 * @param address - The address the chain ends at.
 * @param kind - The kind of entity the address refers to.
 * @returns The retracted event, or null when no chain ends at the address.
 */
export async function retractRenameChainEnd(
  address: string,
  kind: RenameEventKind,
): Promise<RenameEvent | null> {
  // Compute the ledger's current chain ends for the kind
  const chainEnds = await resolveRenameChainEnds(kind);

  // The terminal event of the chain ending at the address
  const terminalEvent = chainEnds.get(address);

  // No chain ends at the address
  if (!terminalEvent) {
    return null;
  }

  // Delete the terminal event's file
  await Fs.removeFile(resolveRenameEventFilePath(terminalEvent));

  return terminalEvent;
}
