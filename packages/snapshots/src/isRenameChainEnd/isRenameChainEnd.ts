import { RenameEventKind } from '../types';
import { resolveRenameChainEnds } from '../utils';

/**
 * Checks whether a recorded rename chain currently ends at the
 * given address.
 *
 * @param address - The entity address to check.
 * @param kind - The kind of entity the address refers to.
 * @returns Whether a rename chain ends at the address.
 */
export async function isRenameChainEnd(
  address: string,
  kind: RenameEventKind,
): Promise<boolean> {
  // Compute the ledger's current chain ends for the kind
  const chainEnds = await resolveRenameChainEnds(kind);

  return chainEnds.has(address);
}
