import { createObjectStore } from '@minddrop/stores';
import { SlotFill, SlotFillKind, SlotFillMap } from './types';

/**
 * A registered fill, stored under a key combining its kind and id so
 * that fills of different kinds never collide.
 */
export interface RegisteredSlotFill {
  /**
   * The store key, `[kind]:[id]`.
   */
  key: string;

  /**
   * The slot kind the fill is registered for.
   */
  kind: string;

  /**
   * The registered fill.
   */
  fill: SlotFill;
}

/**
 * Store of the fills registered for the shell's slots, keyed by
 * `[kind]:[id]`. Knows nothing about kinds: the typed accessors below
 * narrow fills through the `SlotFillMap`.
 */
export const SlotFillsStore = createObjectStore<RegisteredSlotFill>(
  'Views:SlotFills',
  'key',
);

/**
 * Returns the store key of a fill.
 *
 * @param kind - The slot kind.
 * @param id - The fill id.
 */
export function slotFillKey(kind: string, id: string): string {
  return `${kind}:${id}`;
}

/**
 * Returns the fill registered under the given kind and id, or null
 * when none is.
 *
 * @param kind - The slot kind.
 * @param id - The fill id.
 */
export function useSlotFill<TKind extends SlotFillKind>(
  kind: TKind,
  id: string,
): SlotFillMap[TKind] | null {
  const registered = SlotFillsStore.useItem(slotFillKey(kind, id));

  return (registered?.fill as SlotFillMap[TKind] | undefined) ?? null;
}

/**
 * Returns every fill registered for the given kind.
 *
 * @param kind - The slot kind.
 */
export function useSlotFills<TKind extends SlotFillKind>(
  kind: TKind,
): SlotFillMap[TKind][] {
  const registered = SlotFillsStore.useAllItemsArray();

  return registered
    .filter((entry) => entry.kind === kind)
    .map((entry) => entry.fill as SlotFillMap[TKind]);
}
