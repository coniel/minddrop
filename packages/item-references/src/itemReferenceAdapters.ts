import { ItemReferenceAdapter } from './types';

// The registered item reference adapters keyed by entity type.
// Insertion order determines the order in which adapters are offered
// references during resolution.
export const itemReferenceAdapters = new Map<string, ItemReferenceAdapter>();
