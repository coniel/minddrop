import { RenameEvent, RenameEventKind } from '../../types';
import { readRenameEvents } from '../readRenameEvents';

/**
 * Computes the addresses at which recorded rename chains of a given
 * entity kind currently end, mapped to the chains' terminal events.
 *
 * An address stops being a chain end when a later event of the same
 * kind renames away from it. Database renames rewrite the database
 * prefix of chain end addresses without terminating the chains.
 *
 * @param kind - The kind of entity to compute chain ends for.
 * @returns The chain end addresses mapped to their terminal events.
 */
export async function resolveRenameChainEnds(
  kind: RenameEventKind,
): Promise<Map<string, RenameEvent>> {
  // Read the recorded rename events, sorted chronologically
  const events = await readRenameEvents();

  // The chain end addresses mapped to their terminal events
  const chainEnds = new Map<string, RenameEvent>();

  events.forEach((event) => {
    // Database renames rewrite the database prefix of chain end
    // addresses of other kinds
    if (event.kind === 'database' && kind !== 'database') {
      [...chainEnds.entries()].forEach(([address, terminalEvent]) => {
        if (address.startsWith(`${event.from}/`)) {
          chainEnds.delete(address);
          chainEnds.set(
            `${event.to}${address.slice(event.from.length)}`,
            terminalEvent,
          );
        }
      });
    }

    // Only events of the requested kind extend or end chains
    if (event.kind !== kind) {
      return;
    }

    // The event continues any chain ending at its old address
    chainEnds.delete(event.from);

    // The chain now ends at the event's new address
    chainEnds.set(event.to, event);
  });

  return chainEnds;
}
