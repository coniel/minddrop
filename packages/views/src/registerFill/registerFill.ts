import { SlotFillsStore, slotFillKey } from '../SlotFillsStore';
import { SlotFillKind, SlotFillMap } from '../types';

/**
 * Registers a fill for a slot kind, making it available to sessions
 * claiming the slot and to the shell rendering it.
 *
 * @param kind - The slot kind the fill is registered for.
 * @param fill - The fill to register.
 */
export function registerFill<TKind extends SlotFillKind>(
  kind: TKind,
  fill: SlotFillMap[TKind],
): void {
  SlotFillsStore.set({ key: slotFillKey(kind, fill.id), kind, fill });
}
