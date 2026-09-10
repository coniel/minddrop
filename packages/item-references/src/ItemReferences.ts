import { ItemReferenceAdaptersRegistry } from './ItemReferenceAdaptersRegistry';
import { ItemAddressesChangedEvent } from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  AddressesChanged: ItemAddressesChangedEvent,
} as const;

export const {
  store: AdaptersStore,
  register: registerAdapter,
  unregister: unregisterAdapter,
} = ItemReferenceAdaptersRegistry;

export { matchItemReference as match } from './matchItemReference';
export { serializeItemReference as serializeOne } from './serializeItemReference';
export { serializeItemReferences as serialize } from './serializeItemReferences';
export { resolveItemReference as resolveOne } from './resolveItemReference';
export { resolveItemReferences as resolve } from './resolveItemReferences';
