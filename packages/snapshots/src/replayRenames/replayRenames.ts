import { RenameEvent, RenameEventKind } from '../types';
import { readRenameEvents } from '../utils';

/**
 * Resolves the current address of an entity as it was addressed at
 * a given point in time by replaying the renames recorded since
 * then.
 *
 * Replay runs forward from the reference time so that an address
 * reused by a newer entity resolves to the renamed entity rather
 * than to the address's new occupant.
 *
 * The address's entity kind decides which events apply: an entry
 * and a property of the same name share the address form
 * `<database name>/<name>`, so only events of the address's own
 * kind match exactly. Database events rewrite the database prefix
 * of any address kind.
 *
 * @param address - The entity address to resolve.
 * @param kind - The kind of entity the address refers to.
 * @param since - The time at which the address was known to be valid.
 * @returns The entity's current address.
 */
export async function replayRenames(
  address: string,
  kind: RenameEventKind,
  since: Date,
): Promise<string> {
  // Read the recorded rename events, sorted chronologically
  const events = await readRenameEvents();

  // Replay only the renames which happened after the reference time
  const subsequentEvents = events.filter(
    (event) => event.timestamp.getTime() > since.getTime(),
  );

  // Follow the address through each event which matches it
  return subsequentEvents.reduce(
    (currentAddress, event) => applyRenameEvent(currentAddress, kind, event),
    address,
  );
}

/**
 * Applies a single rename event to an address, returning the
 * address unchanged when the event does not affect it.
 */
function applyRenameEvent(
  address: string,
  kind: RenameEventKind,
  event: RenameEvent,
): string {
  // Database events rewrite the database prefix of any address kind
  if (event.kind === 'database' && address.startsWith(`${event.from}/`)) {
    return `${event.to}${address.slice(event.from.length)}`;
  }

  // Events only match addresses of their own kind exactly, since an
  // entry and a property of the same name share the address form
  if (event.kind === kind && address === event.from) {
    return event.to;
  }

  return address;
}
