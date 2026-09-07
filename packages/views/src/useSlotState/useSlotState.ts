import { useSlotFills } from '../SlotFillsStore';
import { useViewPane } from '../ViewPaneContext';
import { DefaultViewAreaId } from '../constants';
import { useActiveViewSession } from '../sessions/ViewSessionsStore';
import { SessionSlot, SlotFillKind, SlotFillMap } from '../types';

export interface SlotState<TKind extends SlotFillKind> {
  /**
   * The id of the fill named by the session's state for the slot, or
   * undefined when it names none.
   */
  fill?: string;

  /**
   * The props the session's state passes to the fill.
   */
  props?: Record<string, unknown>;

  /**
   * Whether the slot is hidden, in which case it renders nothing at
   * all, its fallback included.
   */
  hidden: boolean;

  /**
   * The fill to render and the props to render it with, or null when
   * the slot renders nothing. Lets a slot's frame collapse rather
   * than render an empty container.
   */
  resolved: ResolvedSlotFill<TKind> | null;
}

export interface ResolvedSlotFill<TKind extends SlotFillKind> {
  /**
   * The registered fill to render in the slot.
   */
  fill: SlotFillMap[TKind];

  /**
   * The props to render the fill with.
   */
  props?: Record<string, unknown>;
}

/**
 * Returns a shell slot's state on the active session of the
 * surrounding view area (the main one outside of a view pane), and
 * what it resolves to: the session's fill, the given fallback when it
 * names none or an unregistered one, and nothing at all when the slot
 * is hidden.
 *
 * @param slotId - The id of the slot.
 * @param fallback - What to resolve to when the session names no fill: a state naming the fill and its props, or the id of a fill taking no props.
 */
export function useSlotState<TKind extends SlotFillKind>(
  slotId: TKind,
  fallback?: SessionSlot | string,
): SlotState<TKind> {
  const pane = useViewPane();
  const viewAreaId = pane?.viewAreaId ?? DefaultViewAreaId;
  const session = useActiveViewSession(viewAreaId);
  const fills = useSlotFills(slotId);

  // The session's state for the slot
  const slot = session?.slots?.[slotId];
  const hidden = slot?.hidden ?? false;

  return {
    fill: slot?.fill,
    props: slot?.props,
    hidden,
    resolved: hidden ? null : resolveFill(fills, slot, toSlotState(fallback)),
  };
}

/**
 * Resolves the fill to render for a slot state, falling back when it
 * names no fill or an unregistered one.
 */
function resolveFill<TKind extends SlotFillKind>(
  fills: SlotFillMap[TKind][],
  slot: SessionSlot | undefined,
  fallback: SessionSlot | null,
): ResolvedSlotFill<TKind> | null {
  const fill = slot?.fill
    ? fills.find((registered) => registered.id === slot.fill)
    : undefined;

  // Render the session's fill when it is registered
  if (fill) {
    return { fill, props: slot?.props };
  }

  // Nothing to fall back to
  if (!fallback?.fill) {
    return null;
  }

  const fallbackFill = fills.find(
    (registered) => registered.id === fallback.fill,
  );

  if (!fallbackFill) {
    return null;
  }

  return { fill: fallbackFill, props: fallback.props };
}

/**
 * Normalises a fallback into a slot state, so that the session's
 * state and the fallback resolve through one path.
 */
function toSlotState(
  fallback: SessionSlot | string | undefined,
): SessionSlot | null {
  if (!fallback) {
    return null;
  }

  if (typeof fallback === 'string') {
    return { fill: fallback };
  }

  return fallback;
}
