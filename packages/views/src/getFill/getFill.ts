import { SlotFillsStore, slotFillKey } from '../SlotFillsStore';
import { SlotFillKind, SlotFillMap } from '../types';

/**
 * Gets the fill registered under the given kind and id.
 *
 * @param kind - The slot kind.
 * @param id - The fill id.
 * @returns The fill, or null if it is not registered.
 */
export function getFill<TKind extends SlotFillKind>(
  kind: TKind,
  id: string,
): SlotFillMap[TKind] | null {
  const registered = SlotFillsStore.get(slotFillKey(kind, id));

  return (registered?.fill as SlotFillMap[TKind] | undefined) ?? null;
}
